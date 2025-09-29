// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SplitBill {
    struct Group {
        string name;
        address[] members;
        mapping(address => int256) balances; // Positive: owes group; Negative: owed by group
        uint256[] expenseIds; // List of expense IDs for this group
    }

    struct Expense {
        uint256 groupId; // Group this expense belongs to
        string description;
        uint256 amount; // In wei (SHM, 18 decimals)
        address payer;
        string splitType; // "equal" or "custom"
        mapping(address => uint256) shares; // For custom splits
        uint256[] customShares; // Store custom share percentages
    }

    address public owner;

    mapping(uint256 => Group) public groups;
    mapping(uint256 => Expense) public expenses;
    mapping(address => uint256[]) public userGroups;

    uint256 public groupCount;
    uint256 public expenseCount;

    event GroupCreated(uint256 indexed groupId, string name, address[] members);
    event ExpenseAdded(
        uint256 indexed expenseId,
        uint256 indexed groupId,
        string description,
        uint256 amount,
        address payer,
        string splitType,
        uint256[] customShares
    );
    event DebtRecorded(uint256 indexed groupId, address debtor, address creditor, uint256 amount);
    event DebtSettled(uint256 indexed groupId, address from, address to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Create a group
    function createGroup(string memory _name, address[] memory _members) external returns (uint256) {
        require(_members.length > 1, "Group must have at least 2 members");
        require(bytes(_name).length > 0, "Name required");

        uint256 groupId = groupCount++;
        Group storage g = groups[groupId];
        g.name = _name;

        for (uint256 i = 0; i < _members.length; i++) {
            require(_members[i] != address(0), "Invalid member address");
            g.members.push(_members[i]);
            userGroups[_members[i]].push(groupId);
        }

        emit GroupCreated(groupId, _name, _members);
        return groupId;
    }

    // Add expense to a group
    function addExpense(
        uint256 _groupId,
        string memory _description,
        uint256 _amount,
        string memory _splitType,
        uint256[] memory _customShares
    ) external {
        require(_groupId < groupCount, "Group does not exist");
        require(_amount > 0, "Amount must be greater than 0");
        require(bytes(_description).length > 0, "Description required");
        Group storage g = groups[_groupId];
        require(isMember(msg.sender, _groupId), "Not a group member");

        uint256 expenseId = expenseCount++;
        Expense storage e = expenses[expenseId];
        e.groupId = _groupId;
        e.description = _description;
        e.amount = _amount;
        e.payer = msg.sender;
        e.splitType = _splitType;
        g.expenseIds.push(expenseId); // Link expense to group

        address[] memory members = g.members;
        uint256 numMembers = members.length;

        if (keccak256(bytes(_splitType)) == keccak256(bytes("equal"))) {
            uint256 share = _amount / numMembers;
            uint256 totalDistributed = 0;
            for (uint256 i = 0; i < numMembers; i++) {
                address member = members[i];
                if (member != msg.sender) {
                    e.shares[member] = share;
                    g.balances[member] += int256(share); // Debtor owes
                    totalDistributed += share;
                    emit DebtRecorded(_groupId, member, msg.sender, share);
                }
            }
            g.balances[msg.sender] -= int256(totalDistributed); // Payer credited
        } else if (keccak256(bytes(_splitType)) == keccak256(bytes("custom"))) {
            require(_customShares.length == numMembers, "Custom shares must match members");
            uint256 totalShares = 0;
            for (uint256 i = 0; i < _customShares.length; i++) {
                totalShares += _customShares[i];
            }
            require(totalShares == 100, "Total shares must sum to 100%");

            uint256 totalDistributed = 0;
            for (uint256 i = 0; i < numMembers; i++) {
                address member = members[i];
                uint256 share = (_amount * _customShares[i]) / 100;
                e.shares[member] = share;
                e.customShares.push(_customShares[i]);
                if (member != msg.sender) {
                    g.balances[member] += int256(share);
                    totalDistributed += share;
                    emit DebtRecorded(_groupId, member, msg.sender, share);
                }
            }
            g.balances[msg.sender] -= int256(totalDistributed);
        } else {
            revert("Invalid split type");
        }

        emit ExpenseAdded(expenseId, _groupId, _description, _amount, msg.sender, _splitType, _customShares);
    }

    // Settle debt within a group
    function settleDebt(uint256 _groupId, address _to, uint256 _amount) external {
        require(_groupId < groupCount, "Group does not exist");
        Group storage g = groups[_groupId];
        require(isMember(msg.sender, _groupId) && isMember(_to, _groupId), "Not group members");
        require(_amount > 0, "Amount must be greater than 0");
        require(g.balances[msg.sender] >= int256(_amount), "Insufficient debt to settle");
        require(g.balances[_to] <= -int256(_amount), "Recipient not owed enough");

        g.balances[msg.sender] -= int256(_amount); // Reduce debtor's debt
        g.balances[_to] += int256(_amount); // Reduce creditor's credit

        emit DebtSettled(_groupId, msg.sender, _to, _amount);
    }

    // Get group details
    function getGroup(uint256 _groupId) external view returns (string memory name, address[] memory members) {
        require(_groupId < groupCount, "Group does not exist");
        Group storage g = groups[_groupId];
        return (g.name, g.members);
    }

    // Get group balances
    function getGroupBalances(uint256 _groupId) external view returns (address[] memory members, int256[] memory bals) {
        require(_groupId < groupCount, "Group does not exist");
        Group storage g = groups[_groupId];
        uint256 len = g.members.length;
        members = new address[](len);
        bals = new int256[](len);
        for (uint256 i = 0; i < len; i++) {
            members[i] = g.members[i];
            bals[i] = g.balances[members[i]];
        }
    }

    // Get expense IDs for a group
    function getGroupExpenseIds(uint256 _groupId) external view returns (uint256[] memory) {
        require(_groupId < groupCount, "Group does not exist");
        return groups[_groupId].expenseIds;
    }

    // Get expense details
    function getExpense(uint256 _expenseId) external view returns (
        uint256 groupId,
        string memory description,
        uint256 amount,
        address payer,
        string memory splitType,
        uint256[] memory customShares
    ) {
        require(_expenseId < expenseCount, "Expense does not exist");
        Expense storage e = expenses[_expenseId];
        return (e.groupId, e.description, e.amount, e.payer, e.splitType, e.customShares);
    }

    // Check if address is a group member
    function isMember(address _user, uint256 _groupId) internal view returns (bool) {
        require(_groupId < groupCount, "Group does not exist");
        Group storage g = groups[_groupId];
        for (uint256 i = 0; i < g.members.length; i++) {
            if (g.members[i] == _user) return true;
        }
        return false;
    }

    // Owner withdraws any SHM sent to contract
    function ownerWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}