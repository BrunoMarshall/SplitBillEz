// app.js - Shared Web3 Integration for SplitBillEz
const CONTRACT_ADDRESS = '0x4fbe28ddd98ed3c0a2506d28980d73732f85d04f'; // Deployed contract address

// Full ABI from SplitBill.sol
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "expenseId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "groupId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "ExpenseAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "groupId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address[]",
                "name": "members",
                "type": "address[]"
            }
        ],
        "name": "GroupCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "groupId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "debtor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "creditor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "DebtRecorded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "groupId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "DebtSettled",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "expenses",
        "outputs": [
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "payer",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "splitType",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_groupId",
                "type": "uint256"
            }
        ],
        "name": "getGroup",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "address[]",
                "name": "members",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_groupId",
                "type": "uint256"
            }
        ],
        "name": "getGroupBalances",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "members",
                "type": "address[]"
            },
            {
                "internalType": "int256[]",
                "name": "bals",
                "type": "int256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "address[]",
                "name": "_members",
                "type": "address[]"
            }
        ],
        "name": "createGroup",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_groupId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_splitType",
                "type": "string"
            },
            {
                "internalType": "uint256[]",
                "name": "_customShares",
                "type": "uint256[]"
            }
        ],
        "name": "addExpense",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_groupId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "settleDebt",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ownerWithdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "groupCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "expenseCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "userGroups",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let userAccount;
let contract;

async function initWeb3() {
    if (!window.ethereum) {
        alert('MetaMask is not installed. Please install MetaMask and refresh the page.');
        console.error('MetaMask not detected');
        return false;
    }
    try {
        web3 = new Web3(window.ethereum);
        console.log('Web3 initialized:', !!web3, 'Version:', Web3.version);
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1f90' }] // Shardeum Unstable Testnet (8080)
        }).catch(async (switchError) => {
            if (switchError.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x1f90',
                        chainName: 'Shardeum Unstable Testnet',
                        rpcUrls: ['https://api-unstable.shardeum.org'],
                        nativeCurrency: { name: 'SHM', symbol: 'SHM', decimals: 18 },
                        blockExplorerUrls: ['https://explorer-unstable.shardeum.org']
                    }]
                });
            } else {
                throw switchError;
            }
        });
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts returned by MetaMask');
        }
        userAccount = accounts[0];
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        console.log('Connected account:', userAccount);
        console.log('Contract initialized:', !!contract);
        await updateUI();
        return true;
    } catch (error) {
        console.error('Error initializing Web3:', error);
        alert('Failed to connect to MetaMask: ' + error.message);
        return false;
    }
}

async function disconnectWallet() {
    try {
        userAccount = null;
        contract = null;
        web3 = null;
        await updateUI();
        console.log('Wallet disconnected');
    } catch (error) {
        console.error('Error disconnecting wallet:', error);
        alert('Failed to disconnect wallet: ' + error.message);
    }
}

async function handleMetaMaskToggle() {
    if (userAccount) {
        await disconnectWallet();
    } else {
        await initWeb3();
    }
}

async function updateUI() {
    const buttons = document.querySelectorAll('.metamask-button');
    buttons.forEach(btn => {
        if (userAccount) {
            btn.textContent = `Disconnect (${userAccount.slice(0,6)}...${userAccount.slice(-4)})`;
            btn.style.backgroundColor = '#28a745';
            btn.disabled = false;
        } else {
            btn.textContent = 'Connect with MetaMask';
            btn.style.backgroundColor = '#ffffff';
            btn.disabled = false;
        }
    });
}

function truncateAddress(address) {
    if (!address || typeof address !== 'string' || address.length < 10) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getMemberName(address) {
    const memberNames = JSON.parse(localStorage.getItem('memberNames') || '{}');
    return memberNames[address.toLowerCase()] || truncateAddress(address);
}

function createBlockie(address, size = 32, initial = '') {
    try {
        if (typeof makeBlockie !== 'function') {
            console.warn('Blockies library not loaded, using fallback image');
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ccc';
            ctx.fillRect(0, 0, size, size);
            if (initial) {
                ctx.fillStyle = 'white';
                ctx.font = `${size / 2}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(initial, size / 2, size / 2);
            }
            return canvas.toDataURL();
        }
        const blockie = makeBlockie(address || '0x0');
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(blockie, 0, 0, size, size);
        if (initial) {
            ctx.fillStyle = 'white';
            ctx.font = `${size / 2}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(initial, size / 2, size / 2);
        }
        return canvas.toDataURL();
    } catch (error) {
        console.error('Error creating Blockie:', error);
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ccc';
        ctx.fillRect(0, 0, size, size);
        if (initial) {
            ctx.fillStyle = 'white';
            ctx.font = `${size / 2}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(initial, size / 2, size / 2);
        }
        return canvas.toDataURL();
    }
}

async function checkMetaMaskConnection() {
    console.log('Checking MetaMask connection on page load...');
    try {
        if (window.ethereum) {
            console.log('MetaMask provider detected');
            if (!window.web3 || !window.web3.utils) {
                console.log('Initializing Web3...');
                await window.initWeb3();
            }
            const account = await window.getAccount();
            console.log('MetaMask connected on load:', account);
            if (account) {
                await window.populateDashboard();
            } else {
                console.log('No account connected, waiting for user to connect MetaMask');
                document.getElementById('dashboardContent').innerHTML = 'Please connect MetaMask to view your groups.';
            }
        } else {
            console.log('MetaMask not detected');
            document.getElementById('dashboardContent').innerHTML = 'MetaMask not detected. Please install MetaMask and refresh.';
        }
    } catch (error) {
        console.error('Error checking MetaMask connection:', error);
        document.getElementById('dashboardContent').innerHTML = 'Error checking MetaMask connection: ' + error.message + '. Please refresh and reconnect MetaMask.';
    }
}

async function populateDashboard() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) {
        console.error('dashboardContent element not found');
        return;
    }
    dashboardContent.innerHTML = '<p>Loading groups...</p>';
    if (!window.web3 || !window.web3.utils || !window.getContract() || !window.getAccount()) {
        dashboardContent.innerHTML = '<p>Please connect MetaMask to view your groups.</p>';
        return;
    }
    try {
        const userAddress = await window.getAccount();
        console.log('Fetching groups for dashboard:', userAddress);
        const groupIds = [];
        for (let i = 0; i < 50; i++) {
            let attempts = 3;
            while (attempts > 0) {
                try {
                    const groupId = await window.getContract().methods.userGroups(userAddress, i).call();
                    console.log(`userGroups[${i}]:`, groupId);
                    if (parseInt(groupId) >= 0 && groupId !== "" && groupId !== "0") {
                        groupIds.push(groupId);
                    } else {
                        console.log(`Stopping at index ${i}: invalid groupId ${groupId}`);
                        attempts = 0; // Break loop on invalid groupId
                    }
                    break;
                } catch (error) {
                    console.error(`Error fetching userGroups[${i}], attempt ${4 - attempts}:`, error);
                    attempts--;
                    if (attempts === 0) {
                        console.log(`Stopping at index ${i} after failed attempts`);
                        break;
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            if (attempts === 0) break;
        }
        console.log('Dashboard group IDs:', groupIds);
        if (groupIds.length === 0) {
            dashboardContent.innerHTML = '<p>No groups found. Create one in the Add Expense page.</p>';
            return;
        }
        const events = await window.getContract().getPastEvents('ExpenseAdded', { fromBlock: 0, toBlock: 'latest' });
        console.log('ExpenseAdded events:', events);
        dashboardContent.innerHTML = '';
        for (let groupId of groupIds) {
            try {
                const result = await window.getContract().methods.getGroup(groupId).call();
                console.log(`Group ${groupId} result:`, result);
                const name = result[0] || result.name || 'Unnamed Group';
                const members = result[1] || result.members || [];
                if (!members || !Array.isArray(members)) {
                    console.warn(`Group ${groupId} has invalid members array:`, members);
                    continue;
                }
                let balMembers = [], balances = [];
                try {
                    const balanceData = await window.getContract().methods.getGroupBalances(groupId).call();
                    balMembers = balanceData[0] || balanceData.members || [];
                    balances = balanceData[1] || balanceData.balances || [];
                    console.log(`Group ${groupId} balances:`, { balMembers, balances });
                } catch (error) {
                    console.error(`Error fetching balances for group ${groupId}:`, error);
                }
                const groupExpenses = events
                    .filter(event => String(event.returnValues.groupId) === String(groupId))
                    .map(event => ({
                        id: event.returnValues.expenseId,
                        description: event.returnValues.description || 'No description',
                        amount: window.web3.utils.fromWei(event.returnValues.amount || '0', 'ether'),
                        payer: event.returnValues.payer || 'Unknown',
                        splitType: event.returnValues.splitType || 'Unknown', // Adjust if splitType is available
                        timestamp: event.blockNumber ? new Date((await window.web3.eth.getBlock(event.blockNumber)).timestamp * 1000).toLocaleString() : 'N/A'
                    }));
                console.log(`Group ${groupId} expenses:`, groupExpenses);
                const groupBlockie = window.createBlockie(groupId.toString(), 64);
                const groupDiv = document.createElement('div');
                groupDiv.className = 'group';
                groupDiv.innerHTML = `
                    <img src="${groupBlockie}" alt="Group ${groupId} Avatar" class="group-avatar">
                    <h3>${name} (ID: ${groupId})</h3>
                    <p><strong>Members:</strong> ${members.map(addr => {
                        const initial = window.getMemberName(addr)[0].toUpperCase();
                        return `<img src="${window.createBlockie(addr, 32, initial)}" class="member-avatar" alt="${window.getMemberName(addr)} Avatar"> ${window.getMemberName(addr)}`;
                    }).join(', ')}</p>
                    <h4>Expenses:</h4>
                    ${groupExpenses.length > 0 ? groupExpenses.map(exp => `
                        <p>Expense ${exp.id}: ${exp.description} - ${exp.amount} SHM (Payer: <img src="${window.createBlockie(exp.payer, 32, window.getMemberName(exp.payer)[0].toUpperCase())}" class="member-avatar" alt="${window.getMemberName(exp.payer)} Avatar"> ${window.getMemberName(exp.payer)}, Split: ${exp.splitType}, Date: ${exp.timestamp})</p>
                    `).join('') : '<p>No expenses found.</p>'}
                    <h4>Balances:</h4>
                    ${balMembers.length > 0 ? balMembers.map((addr, i) => `
                        <p><img src="${window.createBlockie(addr, 32, window.getMemberName(addr)[0].toUpperCase())}" class="member-avatar" alt="${window.getMemberName(addr)} Avatar"> ${window.getMemberName(addr)}: ${parseFloat(window.web3.utils.fromWei(balances[i] || '0', 'ether')).toFixed(2)} SHM</p>
                    `).join('') : '<p>No balances available.</p>'}
                    <h4>Settle Debt</h4>
                    <form id="settleDebtForm-${groupId}" class="settle-debt-form">
                        <input type="hidden" name="groupId" value="${groupId}">
                        <label for="settleTo-${groupId}">Pay To:</label>
                        <select id="settleTo-${groupId}" required>
                            <option value="" disabled selected>Select a member</option>
                            ${members
                                .filter(addr => addr.toLowerCase() !== userAddress.toLowerCase())
                                .map(addr => `<option value="${addr}">${window.getMemberName(addr)}</option>`)
                                .join('')}
                        </select>
                        <label for="settleAmount-${groupId}">Amount (SHM):</label>
                        <input type="number" id="settleAmount-${groupId}" placeholder="e.g., 10" step="0.01" required>
                        <button type="submit" class="submit-group">Settle Debt</button>
                    </form>
                    <p id="settleMessage-${groupId}"></p>
                `;
                dashboardContent.appendChild(groupDiv);
                document.getElementById(`settleDebtForm-${groupId}`).addEventListener('submit', async function(e) {
                    e.preventDefault();
                    if (!window.web3 || !window.web3.utils || !window.getContract() || !window.getAccount()) {
                        alert('Please connect MetaMask first.');
                        return;
                    }
                    const settleGroupId = groupId;
                    const toAddress = document.getElementById(`settleTo-${groupId}`).value;
                    const amountInput = document.getElementById(`settleAmount-${groupId}`).value;
                    const settleMessage = document.getElementById(`settleMessage-${groupId}`);
                    let amount;
                    try {
                        amount = window.web3.utils.toWei(amountInput, 'ether');
                    } catch (error) {
                        settleMessage.textContent = 'Invalid amount format. Please enter a valid number.';
                        return;
                    }
                    try {
                        const tx = await window.getContract().methods.settleDebt(settleGroupId, toAddress, amount).send({
                            from: await window.getAccount(),
                            value: '0',
                            type: '0x0'
                        });
                        settleMessage.textContent = `Debt settled! Transaction: https://explorer-unstable.shardeum.org/tx/${tx.transactionHash}`;
                        this.reset();
                        await window.populateDashboard();
                    } catch (error) {
                        console.error(`Debt settlement error for group ${settleGroupId}:`, error);
                        settleMessage.textContent = 'Error: ' + (error.message.includes('Eip1559NotSupportedError') ? 'Network does not support EIP-1559. Try again.' : error.message.includes('revert') ? 'Invalid input or contract revert. Check inputs and try again.' : error.message);
                    }
                });
            } catch (error) {
                console.error(`Error processing group ${groupId}:`, error);
            }
        }
    } catch (error) {
        console.error('Error populating dashboard:', error);
        dashboardContent.innerHTML = '<p>Error loading groups. Please try again.</p>';
    }
}

// Export globals
window.initWeb3 = initWeb3;
window.disconnectWallet = disconnectWallet;
window.handleMetaMaskToggle = handleMetaMaskToggle;
window.getContract = () => contract;
window.getAccount = () => userAccount;
window.web3 = web3;
window.truncateAddress = truncateAddress;
window.getMemberName = getMemberName;
window.createBlockie = createBlockie;
window.checkMetaMaskConnection = checkMetaMaskConnection;
window.populateDashboard = populateDashboard;