// app.js - Shared Web3 Integration for SplitBillEz
const CONTRACT_ADDRESS = '0x4fbe28ddd98ed3c0a2506d28980d73732f85d04f';
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": false, "internalType": "uint256", "name": "expenseId", "type": "uint256"},
            {"indexed": false, "internalType": "uint256", "name": "groupId", "type": "uint256"},
            {"indexed": false, "internalType": "string", "name": "description", "type": "string"},
            {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "ExpenseAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": false, "internalType": "uint256", "name": "groupId", "type": "uint256"},
            {"indexed": false, "internalType": "string", "name": "name", "type": "string"},
            {"indexed": false, "internalType": "address[]", "name": "members", "type": "address[]"}
        ],
        "name": "GroupCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": false, "internalType": "uint256", "name": "groupId", "type": "uint256"},
            {"indexed": false, "internalType": "address", "name": "debtor", "type": "address"},
            {"indexed": false, "internalType": "address", "name": "creditor", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "DebtRecorded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": false, "internalType": "uint256", "name": "groupId", "type": "uint256"},
            {"indexed": false, "internalType": "address", "name": "from", "type": "address"},
            {"indexed": false, "internalType": "address", "name": "to", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "DebtSettled",
        "type": "event"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "expenses",
        "outputs": [
            {"internalType": "string", "name": "description", "type": "string"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"},
            {"internalType": "address", "name": "payer", "type": "address"},
            {"internalType": "string", "name": "splitType", "type": "string"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_groupId", "type": "uint256"}],
        "name": "getGroup",
        "outputs": [
            {"internalType": "string", "name": "name", "type": "string"},
            {"internalType": "address[]", "name": "members", "type": "address[]"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_groupId", "type": "uint256"}],
        "name": "getGroupBalances",
        "outputs": [
            {"internalType": "address[]", "name": "members", "type": "address[]"},
            {"internalType": "int256[]", "name": "bals", "type": "int256[]"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "_name", "type": "string"},
            {"internalType": "address[]", "name": "_members", "type": "address[]"}
        ],
        "name": "createGroup",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_groupId", "type": "uint256"},
            {"internalType": "string", "name": "_description", "type": "string"},
            {"internalType": "uint256", "name": "_amount", "type": "uint256"},
            {"internalType": "string", "name": "_splitType", "type": "string"},
            {"internalType": "uint256[]", "name": "_customShares", "type": "uint256[]"}
        ],
        "name": "addExpense",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_groupId", "type": "uint256"},
            {"internalType": "address", "name": "_to", "type": "address"},
            {"internalType": "uint256", "name": "_amount", "type": "uint256"}
        ],
        "name": "settleDebt",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
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
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "expenseCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "", "type": "address"},
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "name": "userGroups",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let userAccount;
let contract;
let shmPrice = null;

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
        shmPrice = null;
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
        if (document.getElementById('groupId')) {
            await populateGroupDropdown();
        } else if (document.getElementById('dashboardContent')) {
            await populateDashboard();
        }
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
    return memberNames[address?.toLowerCase()] || truncate Kedro
truncateAddress(address);
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
        if (!window.ethereum) {
            console.log('MetaMask not detected');
            if (document.getElementById('dashboardContent')) {
                document.getElementById('dashboardContent').innerHTML = 'MetaMask not detected. Please install MetaMask and refresh.';
            } else if (document.getElementById('expenseMessage')) {
                document.getElementById('expenseMessage').textContent = 'MetaMask not detected. Please install MetaMask and refresh.';
            }
            return;
        }
        console.log('MetaMask provider detected');
        if (!web3) {
            console.log('Initializing Web3...');
            await initWeb3();
        }
        const account = await getAccount();
        console.log('MetaMask connected on load:', account);
        if (account) {
            if (document.getElementById('userAddress')) {
                document.getElementById('userAddress').value = account;
                await fetchShmPrice();
                await populateGroupDropdown();
            } else if (document.getElementById('dashboardContent')) {
                await populateDashboard();
            }
        } else {
            console.log('No account connected, waiting for user to connect MetaMask');
            if (document.getElementById('dashboardContent')) {
                document.getElementById('dashboardContent').innerHTML = 'Please connect MetaMask to view your groups.';
            } else if (document.getElementById('expenseMessage')) {
                document.getElementById('expenseMessage').textContent = 'Please connect MetaMask to load groups.';
            }
        }
    } catch (error) {
        console.error('Error checking MetaMask connection:', error);
        if (document.getElementById('dashboardContent')) {
            document.getElementById('dashboardContent').innerHTML = 'Error checking MetaMask connection: ' + error.message + '. Please refresh and reconnect MetaMask.';
        } else if (document.getElementById('expenseMessage')) {
            document.getElementById('expenseMessage').textContent = 'Error checking MetaMask connection: ' + error.message + '. Please refresh and reconnect MetaMask.';
        }
    }
}

async function populateDashboard() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) {
        console.error('dashboardContent element not found');
        return;
    }
    dashboardContent.innerHTML = '<p>Loading groups...</p>';
    if (!web3 || !getContract() || !getAccount()) {
        dashboardContent.innerHTML = '<p>Please connect MetaMask to view your groups.</p>';
        return;
    }
    try {
        const userAddress = await getAccount();
        console.log('Fetching groups for dashboard, user:', userAddress);
        const groupCount = parseInt(await getContract().methods.groupCount().call()) || 0;
        console.log('Total group count from contract:', groupCount);
        const groupIds = new Set();
        let totalAttempts = 0;
        const maxTotalAttempts = 150; // Cap total retries to prevent infinite loop
        for (let i = 0; i < Math.min(groupCount, 50); i++) {
            let attempts = 3;
            while (attempts > 0 && totalAttempts < maxTotalAttempts) {
                totalAttempts++;
                try {
                    const groupId = await getContract().methods.userGroups(userAddress, i).call();
                    console.log(`userGroups[${i}]:`, groupId);
                    if (groupId && parseInt(groupId) > 0 && groupId !== "0") {
                        groupIds.add(groupId);
                        break; // Move to next index after success
                    } else {
                        console.log(`Stopping userGroups scan at index ${i}: invalid groupId ${groupId}`);
                        break;
                    }
                } catch (error) {
                    console.error(`Error fetching userGroups[${i}], attempt ${4 - attempts}:`, error);
                    attempts--;
                    if (attempts === 0) {
                        console.log(`Stopping userGroups scan at index ${i} after failed attempts`);
                        break;
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            if (attempts === 0 || totalAttempts >= maxTotalAttempts) {
                console.log(`Exiting userGroups loop at index ${i}: ${attempts === 0 ? 'failed attempts' : 'max total attempts reached'}`);
                break;
            }
        }
        console.log('Group IDs from userGroups:', Array.from(groupIds));
        if (groupIds.size === 0) {
            console.log('No groups found in userGroups, attempting fallback group scan');
            for (let i = 1; i <= groupCount && i <= 50; i++) {
                try {
                    const result = await getContract().methods.getGroup(i).call();
                    const members = result[1] || result.members || [];
                    if (members && Array.isArray(members) && members.map(addr => addr.toLowerCase()).includes(userAddress.toLowerCase())) {
                        groupIds.add(i.toString());
                    }
                } catch (error) {
                    console.error(`Error fetching group ${i} in fallback scan:`, error);
                }
            }
            console.log('Group IDs from fallback scan:', Array.from(groupIds));
        }
        if (groupIds.size === 0) {
            dashboardContent.innerHTML = '<p>No groups found for this account. Create one in the Add Expense page or verify your MetaMask account.</p>';
            return;
        }
        const events = await getContract().getPastEvents('ExpenseAdded', { fromBlock: 0, toBlock: 'latest' });
        console.log('ExpenseAdded events:', events);
        dashboardContent.innerHTML = '';
        for (let groupId of groupIds) {
            try {
                const result = await getContract().methods.getGroup(groupId).call();
                console.log(`Group ${groupId} result:`, result);
                const name = result[0] || result.name || 'Unnamed Group';
                const members = result[1] || result.members || [];
                if (!members || !Array.isArray(members)) {
                    console.warn(`Group ${groupId} has invalid members array:`, members);
                    continue;
                }
                let balMembers = [], balances = [];
                try {
                    const balanceData = await getContract().methods.getGroupBalances(groupId).call();
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
                        amount: web3.utils.fromWei(event.returnValues.amount || '0', 'ether'),
                        payer: event.returnValues.payer || 'Unknown',
                        splitType: event.returnValues.splitType || 'Unknown',
                        timestamp: event.blockNumber ? (async () => {
                            try {
                                const block = await web3.eth.getBlock(event.blockNumber);
                                return new Date(block.timestamp * 1000).toLocaleString();
                            } catch {
                                return 'N/A';
                            }
                        })() : 'N/A'
                    }));
                console.log(`Group ${groupId} expenses:`, groupExpenses);
                const groupBlockie = createBlockie(groupId.toString(), 64);
                const groupDiv = document.createElement('div');
                groupDiv.className = 'group';
                groupDiv.innerHTML = `
                    <img src="${groupBlockie}" alt="Group ${groupId} Avatar" class="group-avatar">
                    <h3>${name} (ID: ${groupId})</h3>
                    <p><strong>Members:</strong> ${members.map(addr => {
                        const initial = getMemberName(addr)[0].toUpperCase();
                        return `<img src="${createBlockie(addr, 32, initial)}" class="member-avatar" alt="${getMemberName(addr)} Avatar"> ${getMemberName(addr)}`;
                    }).join(', ')}</p>
                    <h4>Expenses:</h4>
                    <div class="expenses-placeholder">Loading expenses...</div>
                    <h4>Balances:</h4>
                    ${balMembers.length > 0 ? balMembers.map((addr, i) => `
                        <p><img src="${createBlockie(addr, 32, getMemberName(addr)[0].toUpperCase())}" class="member-avatar" alt="${getMemberName(addr)} Avatar"> ${getMemberName(addr)}: ${parseFloat(web3.utils.fromWei(balances[i] || '0', 'ether')).toFixed(2)} SHM</p>
                    `).join('') : '<p>No balances available.</p>'}
                    <h4>Settle Debt</h4>
                    <form id="settleDebtForm-${groupId}" class="settle-debt-form">
                        <input type="hidden" name="groupId" value="${groupId}">
                        <label for="settleTo-${groupId}">Pay To:</label>
                        <select id="settleTo-${groupId}" required>
                            <option value="" disabled selected>Select a member</option>
                            ${members
                                .filter(addr => addr.toLowerCase() !== userAddress.toLowerCase())
                                .map(addr => `<option value="${addr}">${getMemberName(addr)}</option>`)
                                .join('')}
                        </select>
                        <label for="settleAmount-${groupId}">Amount (SHM):</label>
                        <input type="number" id="settleAmount-${groupId}" placeholder="e.g., 10" step="0.01" required>
                        <button type="submit" class="submit-group">Settle Debt</button>
                    </form>
                    <p id="settleMessage-${groupId}"></p>
                `;
                dashboardContent.appendChild(groupDiv);
                const expensePromises = groupExpenses.map(exp => exp.timestamp);
                Promise.all(expensePromises).then(async timestamps => {
                    const expenseElements = groupExpenses.map((exp, idx) => `
                        <p>Expense ${exp.id}: ${exp.description} - ${exp.amount} SHM (Payer: <img src="${createBlockie(exp.payer, 32, getMemberName(exp.payer)[0].toUpperCase())}" class="member-avatar" alt="${getMemberName(exp.payer)} Avatar"> ${getMemberName(exp.payer)}, Split: ${exp.splitType}, Date: ${timestamps[idx]})</p>
                    `);
                    const expensesHTML = expenseElements.length > 0 ? expenseElements.join('') : '<p>No expenses found.</p>';
                    groupDiv.querySelector('.expenses-placeholder').outerHTML = expensesHTML;
                });
                document.getElementById(`settleDebtForm-${groupId}`).addEventListener('submit', async function(e) {
                    e.preventDefault();
                    if (!web3 || !getContract() || !getAccount()) {
                        alert('Please connect MetaMask first.');
                        return;
                    }
                    const settleGroupId = groupId;
                    const toAddress = document.getElementById(`settleTo-${groupId}`)?.value;
                    const amountInput = document.getElementById(`settleAmount-${groupId}`)?.value;
                    const settleMessage = document.getElementById(`settleMessage-${groupId}`);
                    let amount;
                    try {
                        amount = web3.utils.toWei(amountInput, 'ether');
                    } catch (error) {
                        settleMessage.textContent = 'Invalid amount format. Please enter a valid number.';
                        return;
                    }
                    try {
                        const tx = await getContract().methods.settleDebt(settleGroupId, toAddress, amount).send({
                            from: await getAccount(),
                            value: '0',
                            type: '0x0'
                        });
                        settleMessage.textContent = `Debt settled! Transaction: https://explorer-unstable.shardeum.org/tx/${tx.transactionHash}`;
                        this.reset();
                        await populateDashboard();
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
        dashboardContent.innerHTML = '<p>Error loading groups. Please verify your MetaMask account and try again.</p>';
    }
}

async function fetchShmPrice() {
    const cacheKeyPrefix = 'shmPriceCache_';
    const cacheTimestampKeyPrefix = 'shmPriceTimestamp_';
    const cacheDuration = 10 * 60 * 1000; // 10 minutes
    const now = Date.now();
    const currencies = ['usd', 'eur', 'inr'];
    shmPrice = shmPrice || {};
    
    for (const currency of currencies) {
        const cacheKey = `${cacheKeyPrefix}${currency}`;
        const cacheTimestampKey = `${cacheTimestampKeyPrefix}${currency}`;
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
        
        if (cachedData && cachedTimestamp && (now - parseInt(cachedTimestamp)) < cacheDuration) {
            console.log(`Using cached SHM price for ${currency}:`, JSON.parse(cachedData));
            shmPrice[currency] = JSON.parse(cachedData);
            continue;
        }
        
        try {
            console.log(`Fetching SHM price for ${currency} from CoinGecko`);
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=shardeum&vs_currencies=${currency}`);
            const data = await response.json();
            const price = data.shardeum?.[currency] || (currency === 'usd' ? 0.11 : currency === 'eur' ? 0.1 : 9.0);
            shmPrice[currency] = price;
            console.log(`Fetched SHM price for ${currency}:`, price);
            localStorage.setItem(cacheKey, JSON.stringify(price));
            localStorage.setItem(cacheTimestampKey, now.toString());
        } catch (error) {
            console.error(`Error fetching SHM price for ${currency}:`, error);
            shmPrice[currency] = currency === 'usd' ? 0.11 : currency === 'eur' ? 0.1 : 9.0;
            localStorage.setItem(cacheKey, JSON.stringify(shmPrice[currency]));
            localStorage.setItem(cacheTimestampKey, now.toString());
        }
    }
    
    const shmAmountElement = document.getElementById('shmAmount');
    if (shmAmountElement && !Object.keys(shmPrice).length) {
        shmAmountElement.textContent = 'Error fetching SHM price. Using default.';
    }
    updateShmAmount();
}

function updateShmAmount() {
    const amountInput = document.getElementById('amount');
    const currency = document.getElementById('currency');
    const shmAmountElement = document.getElementById('shmAmount');
    if (!shmAmountElement || !amountInput || !currency) return;
    if (!shmPrice || !amountInput.value) {
        shmAmountElement.textContent = 'SHM Amount: Enter amount and select currency';
        return;
    }
    const amount = parseFloat(amountInput.value);
    const shmAmount = amount / shmPrice[currency.value.toLowerCase()];
    shmAmountElement.textContent = `SHM Amount: ${shmAmount.toFixed(4)} SHM`;
}

async function populateGroupDropdown() {
    const groupSelect = document.getElementById('groupId');
    const groupCreationDiv = document.getElementById('groupCreation');
    const submitButton = document.getElementById('submitButton');
    const expenseMessage = document.getElementById('expenseMessage');
    if (!groupSelect || !groupCreationDiv || !submitButton || !expenseMessage) {
        console.error('Required elements not found');
        return;
    }
    groupSelect.innerHTML = '<option value="" disabled selected>Loading groups...</option>';
    if (!web3 || !getContract() || !getAccount()) {
        console.error('Web3.js, contract, or account not initialized');
        groupSelect.innerHTML = '<option value="" disabled selected>Connect wallet first</option>';
        groupCreationDiv.style.display = 'none';
        submitButton.textContent = 'Add Expense';
        expenseMessage.textContent = 'Please connect MetaMask to view groups.';
        return;
    }
    try {
        const userAddress = await getAccount();
        console.log('Fetching groups for:', userAddress);
        document.getElementById('userAddress').value = userAddress;
        const groupCount = parseInt(await getContract().methods.groupCount().call()) || 0;
        console.log('Total group count from contract:', groupCount);
        const groupIds = new Set();
        let totalAttempts = 0;
        const maxTotalAttempts = 150; // Cap total retries to prevent infinite loop
        for (let i = 0; i < Math.min(groupCount, 50); i++) {
            let attempts = 3;
            while (attempts > 0 && totalAttempts < maxTotalAttempts) {
                totalAttempts++;
                try {
                    const groupId = await getContract().methods.userGroups(userAddress, i).call();
                    console.log(`userGroups[${i}]:`, groupId);
                    if (groupId && parseInt(groupId) > 0 && groupId !== "0") {
                        groupIds.add(groupId);
                        break; // Move to next index after success
                    } else {
                        console.log(`Stopping userGroups scan at index ${i}: invalid groupId ${groupId}`);
                        break;
                    }
                } catch (error) {
                    console.error(`Error fetching userGroups[${i}], attempt ${4 - attempts}:`, error);
                    attempts--;
                    if (attempts === 0) {
                        console.log(`Stopping userGroups scan at index ${i} after failed attempts`);
                        break;
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            if (attempts === 0 || totalAttempts >= maxTotalAttempts) {
                console.log(`Exiting userGroups loop at index ${i}: ${attempts === 0 ? 'failed attempts' : 'max total attempts reached'}`);
                break;
            }
        }
        console.log('Group IDs from userGroups:', Array.from(groupIds));
        if (groupIds.size === 0) {
            console.log('No groups found in userGroups, attempting fallback group scan');
            for (let i = 1; i <= groupCount && i <= 50; i++) {
                try {
                    const result = await getContract().methods.getGroup(i).call();
                    const members = result[1] || result.members || [];
                    if (members && Array.isArray(members) && members.map(addr => addr.toLowerCase()).includes(userAddress.toLowerCase())) {
                        groupIds.add(i.toString());
                    }
                } catch (error) {
                    console.error(`Error fetching group ${i} in fallback scan:`, error);
                }
            }
            console.log('Group IDs from fallback scan:', Array.from(groupIds));
        }
        groupSelect.innerHTML = '<option value="" disabled selected>Select a group</option>';
        if (groupIds.size === 0) {
            groupSelect.innerHTML += '<option value="create">Create a new group</option>';
            groupCreationDiv.style.display = 'block';
            submitButton.textContent = 'Create Group';
            expenseMessage.textContent = 'No groups found for this account. Create one to add expenses or verify your MetaMask account.';
        } else {
            groupCreationDiv.style.display = 'none';
            submitButton.textContent = 'Add Expense';
            expenseMessage.textContent = '';
            for (let groupId of groupIds) {
                try {
                    const result = await getContract().methods.getGroup(groupId).call();
                    console.log(`Group ${groupId} result:`, result);
                    const name = result[0] || result.name || 'Unnamed Group';
                    const members = result[1] || result.members || [];
                    if (!members || !Array.isArray(members)) {
                        console.warn(`Group ${groupId} has invalid members array:`, members);
                        continue;
                    }
                    const option = document.createElement('option');
                    option.value = groupId;
                    option.textContent = `${name} (ID: ${groupId})`;
                    groupSelect.appendChild(option);
                } catch (error) {
                    console.error(`Error fetching group ${groupId}:`, error);
                }
            }
            const createOption = document.createElement('option');
            createOption.value = 'create';
            createOption.textContent = 'Create a new group';
            groupSelect.appendChild(createOption);
        }
    } catch (error) {
        console.error('Error fetching groups:', error);
        groupSelect.innerHTML = '<option value="" disabled selected>Error loading groups</option><option value="create">Create a new group</option>';
        groupCreationDiv.style.display = 'block';
        submitButton.textContent = 'Create Group';
        expenseMessage.textContent = 'Error loading groups. Please create a new group or verify your MetaMask account.';
    }
}

function toggleCustomShares() {
    const splitSelect = document.getElementById('split');
    const customInput = document.getElementById('customShares');
    const customLabel = document.getElementById('customLabel');
    if (!splitSelect || !customInput || !customLabel) return;
    const show = splitSelect.value === 'custom';
    customInput.style.display = show ? 'block' : 'none';
    customLabel.style.display = show ? 'block' : 'none';
}

function toggleGroupCreation() {
    const groupSelect = document.getElementById('groupId');
    const groupCreationDiv = document.getElementById('groupCreation');
    const submitButton = document.getElementById('submitButton');
    if (!groupSelect || !groupCreationDiv || !submitButton) return;
    groupCreationDiv.style.display = groupSelect.value === 'create' ? 'block' : 'none';
    submitButton.textContent = groupSelect.value === 'create' ? 'Create Group' : 'Add Expense';
}

function addMemberField() {
    const memberInputs = document.getElementById('memberInputs');
    if (!memberInputs) return;
    const memberCount = memberInputs.children.length;
    if (memberCount >= 10) {
        alert('Maximum 10 members allowed per group.');
        return;
    }
    const div = document.createElement('div');
    div.className = 'member-input';
    div.innerHTML = `
        <input type="text" class="member-name" placeholder="Member Name (e.g., Bob)">
        <input type="text" class="member-address" placeholder="e.g., 0x742d...">
        <button type="button" class="remove-member">Remove</button>
    `;
    memberInputs.appendChild(div);
    updateRemoveButtons();
    const newRemoveButton = div.querySelector('.remove-member');
    if (newRemoveButton) {
        newRemoveButton.addEventListener('click', () => removeMember(newRemoveButton));
    }
}

function removeMember(button) {
    const memberInputs = document.getElementById('memberInputs');
    if (!memberInputs) return;
    if (memberInputs.children.length > 2) {
        button.parentElement.remove();
        updateRemoveButtons();
    } else {
        alert('At least one additional member is required besides your address.');
    }
}

function updateRemoveButtons() {
    const memberInputs = document.getElementById('memberInputs');
    if (!memberInputs) return;
    const removeButtons = document.getElementsByClassName('remove-member');
    for (let btn of removeButtons) {
        btn.style.display = memberInputs.children.length > 2 ? 'inline-block' : 'none';
    }
}

async function handleExpenseFormSubmit(e) {
    e.preventDefault();
    if (!web3 || !getContract() || !getAccount()) {
        alert('Web3 not initialized or wallet not connected. Please ensure MetaMask is installed and connected.');
        return;
    }
    const groupId = document.getElementById('groupId')?.value;
    const expenseMessage = document.getElementById('expenseMessage');
    const submitButton = document.getElementById('submitButton');
    const groupCreationDiv = document.getElementById('groupCreation');
    if (!expenseMessage || !submitButton || !groupCreationDiv) {
        console.error('Required form elements not found');
        return;
    }
    if (groupId === 'create') {
        const groupName = document.getElementById('groupName')?.value;
        const memberInputs = document.getElementsByClassName('member-input');
        if (!groupName) {
            expenseMessage.textContent = 'Please enter a group name.';
            return;
        }
        const members = [];
        const newMemberNames = {};
        try {
            const userAddress = (await getAccount()).toLowerCase();
            for (let input of Array.from(memberInputs)) {
                const addressInput = input.querySelector('.member-address');
                const nameInput = input.querySelector('.member-name');
                const address = addressInput?.value?.trim().toLowerCase() || '';
                const name = nameInput?.value?.trim() || '';
                if (address && web3.utils.isAddress(address) || address === userAddress) {
                    members.push(address);
                    if (name) newMemberNames[address] = name;
                }
            }
            console.log('Submitting members:', members);
            console.log('Saving member names:', newMemberNames);
            if (members.length < 2) {
                expenseMessage.textContent = 'Please include at least two valid Ethereum addresses (including yours).';
                return;
            }
            if (!members.includes(userAddress)) {
                expenseMessage.textContent = 'Your address is missing from the member list.';
                return;
            }
            const existingNames = JSON.parse(localStorage.getItem('memberNames') || '{}');
            localStorage.setItem('memberNames', JSON.stringify({ ...existingNames, ...newMemberNames }));
            const tx = await getContract().methods.createGroup(groupName, members).send({
                from: await getAccount(),
                value: '0',
                type: '0x0'
            });
            expenseMessage.textContent = `Group created! Transaction: https://explorer-unstable.shardeum.org/tx/${tx.transactionHash}`;
            groupCreationDiv.style.display = 'none';
            submitButton.textContent = 'Add Expense';
            e.target.reset();
            await populateGroupDropdown();
            const groupCount = await getContract().methods.groupCount().call();
            document.getElementById('groupId').value = parseInt(groupCount) - 1;
        } catch (error) {
            console.error('Group creation error:', error);
            expenseMessage.textContent = 'Error: ' + (error.message.includes('Eip1559NotSupportedError') ? 'Network does not support EIP-1559. Try again.' : error.message.includes('revert') ? 'Invalid input or contract revert. Check addresses and try again.' : error.message);
        }
        return;
    }
    if (!groupId) {
        expenseMessage.textContent = 'Please select a group.';
        return;
    }
    const description = document.getElementById('description')?.value;
    const amountInput = document.getElementById('amount')?.value;
    const currency = document.getElementById('currency')?.value;
    let amount;
    try {
        const shmAmount = parseFloat(amountInput) / shmPrice[currency.toLowerCase()];
        amount = web3.utils.toWei(shmAmount.toString(), 'ether');
    } catch (error) {
        console.error('Error converting amount:', error);
        expenseMessage.textContent = 'Invalid amount format or SHM price not loaded. Please try again.';
        return;
    }
    const splitType = document.getElementById('split')?.value;
    let customShares = [];
    if (splitType === 'custom') {
        try {
            customShares = document.getElementById('customShares')?.value.split(',').map(s => parseInt(s.trim()));
            const total = customShares.reduce((sum, val) => sum + val, 0);
            if (total !== 100) {
                expenseMessage.textContent = 'Custom shares must sum to 100%.';
                return;
            }
            const [_, members] = await getContract().methods.getGroup(groupId).call();
            if (customShares.length !== members.length) {
                expenseMessage.textContent = `Custom shares count (${customShares.length}) must match group members (${members.length}).`;
                return;
            }
        } catch (error) {
            console.error('Error processing custom shares:', error);
            expenseMessage.textContent = 'Invalid custom shares format. Use comma-separated percentages (e.g., 40,30,30).';
            return;
        }
    }
    try {
        const tx = await getContract().methods.addExpense(groupId, description, amount, splitType, customShares).send({
            from: await getAccount(),
            value: '0',
            type: '0x0'
        });
        expenseMessage.textContent = `Expense added! Transaction: https://explorer-unstable.shardeum.org/tx/${tx.transactionHash}`;
        e.target.reset();
        document.getElementById('customShares').style.display = 'none';
        document.getElementById('customLabel').style.display = 'none';
        await populateGroupDropdown();
    } catch (error) {
        console.error('Expense error:', error);
        expenseMessage.textContent = 'Error: ' + (error.message.includes('Eip1559NotSupportedError') ? 'Network does not support EIP-1559. Try again.' : error.message.includes('revert') ? 'Invalid input or contract revert. Check group ID and try again.' : error.message);
    }
}

function initExpenseForm() {
    const expenseForm = document.getElementById('expenseForm');
    if (expenseForm) {
        expenseForm.addEventListener('submit', handleExpenseFormSubmit);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired, initializing app');
    initExpenseForm();
    checkMetaMaskConnection();
    const buttons = document.querySelectorAll('.metamask-button');
    buttons.forEach(btn => {
        btn.addEventListener('click', handleMetaMaskToggle);
    });
    const currencySelect = document.getElementById('currency');
    if (currencySelect) {
        currencySelect.addEventListener('change', updateShmAmount);
    }
    const groupSelect = document.getElementById('groupId');
    if (groupSelect) {
        groupSelect.addEventListener('change', toggleGroupCreation);
    }
    const splitSelect = document.getElementById('split');
    if (splitSelect) {
        splitSelect.addEventListener('change', toggleCustomShares);
    }
    const addMemberButton = document.getElementById('addMemberButton');
    if (addMemberButton) {
        addMemberButton.addEventListener('click', addMemberField);
    }
    const removeMemberButtons = document.getElementsByClassName('remove-member');
    Array.from(removeMemberButtons).forEach(btn => {
        btn.addEventListener('click', () => removeMember(btn));
    });
});

window.initWeb3 = initWeb3;
window.disconnectWallet = disconnectWallet;
window.handleMetaMaskToggle = handleMetaMaskToggle;
window.getContract = () => contract;
window.getAccount = () => userAccount;
window.truncateAddress = truncateAddress;
window.getMemberName = getMemberName;
window.createBlockie = createBlockie;
window.checkMetaMaskConnection = checkMetaMaskConnection;
window.populateDashboard = populateDashboard;
window.fetchShmPrice = fetchShmPrice;
window.updateShmAmount = updateShmAmount;
window.populateGroupDropdown = populateGroupDropdown;
window.toggleCustomShares = toggleCustomShares;
window.toggleGroupCreation = toggleGroupCreation;
window.addMemberField = addMemberField;
window.removeMember = removeMember;
window.updateRemoveButtons = updateRemoveButtons;
window.initExpenseForm = initExpenseForm;