// app.js - Shared Web3 Integration for SplitBillEz
const CONTRACT_ADDRESS = '0xff99db46c84bb5a241b2560807dab98c04d5c411';
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "expenseId", "type": "uint256"},
            {"indexed": true, "internalType": "uint256", "name": "groupId", "type": "uint256"},
            {"indexed": false, "internalType": "string", "name": "description", "type": "string"},
            {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
            {"indexed": false, "internalType": "address", "name": "payer", "type": "address"},
            {"indexed": false, "internalType": "string", "name": "splitType", "type": "string"},
            {"indexed": false, "internalType": "uint256[]", "name": "customShares", "type": "uint256[]"}
        ],
        "name": "ExpenseAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "groupId", "type": "uint256"},
            {"indexed": false, "internalType": "string", "name": "name", "type": "string"},
            {"indexed": false, "internalType": "address[]", "name": "members", "type": "address[]"}
        ],
        "name": "GroupCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "groupId", "type": "uint256"},
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
            {"indexed": true, "internalType": "uint256", "name": "groupId", "type": "uint256"},
            {"indexed": false, "internalType": "address", "name": "from", "type": "address"},
            {"indexed": false, "internalType": "address", "name": "to", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "DebtSettled",
        "type": "event"
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
            {"internalType": "string", "name": "_name", "type": "string"},
            {"internalType": "address[]", "name": "_members", "type": "address[]"}
        ],
        "name": "createGroup",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_expenseId", "type": "uint256"}],
        "name": "getExpense",
        "outputs": [
            {"internalType": "uint256", "name": "groupId", "type": "uint256"},
            {"internalType": "string", "name": "description", "type": "string"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"},
            {"internalType": "address", "name": "payer", "type": "address"},
            {"internalType": "string", "name": "splitType", "type": "string"},
            {"internalType": "uint256[]", "name": "customShares", "type": "uint256[]"}
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
        "inputs": [{"internalType": "uint256", "name": "_groupId", "type": "uint256"}],
        "name": "getGroupExpenseIds",
        "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
        "stateMutability": "view",
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
        "name": "expenseCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
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
const RPC_URLS = ['https://api-unstable.shardeum.org', 'https://cycle3.api.shardeum.org', 'https://dapps.shardeum.org'];

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

async function initWeb3(rpcIndex = 0, maxRetries = 3) {
    console.log('Initializing Web3 for', isMobileDevice() ? 'mobile' : 'desktop');
    if (!window.ethereum) {
        const message = isMobileDevice()
            ? 'Please open this page in the MetaMask in-app browser or ensure MetaMask is installed and accessible. <a href="metamask://dapp/www.splitbillez.com">Open in MetaMask</a>'
            : 'MetaMask is not installed. Please install MetaMask and refresh the page.';
        alert(message);
        console.error('MetaMask not detected:', message);
        if (isMobileDevice()) {
            document.body.innerHTML += '<div style="text-align: center; margin-top: 20px;"><a href="metamask://dapp/www.splitbillez.com">Open in MetaMask</a></div>';
        }
        return false;
    }
    try {
        web3 = new Web3(window.ethereum);
        console.log('Web3 initialized with window.ethereum:', !!web3, 'Version:', Web3.version);
        console.log('Using RPC:', RPC_URLS[rpcIndex]);

        let chainSwitchAttempts = 0;
        const maxChainSwitchAttempts = 3;
        while (chainSwitchAttempts < maxChainSwitchAttempts) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x1f90' }]
                });
                break;
            } catch (switchError) {
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x1f90',
                            chainName: 'Shardeum Unstable Testnet',
                            rpcUrls: [RPC_URLS[rpcIndex]],
                            nativeCurrency: { name: 'SHM', symbol: 'SHM', decimals: 18 },
                            blockExplorerUrls: ['https://explorer-unstable.shardeum.org']
                        }]
                    });
                    break;
                } else if (switchError.message.includes('network error') && chainSwitchAttempts < maxChainSwitchAttempts - 1) {
                    console.warn(`Chain switch failed, retrying (${chainSwitchAttempts + 1}/${maxChainSwitchAttempts})...`);
                    chainSwitchAttempts++;
                    await new Promise(resolve => setTimeout(resolve, 3000)); // Increased delay
                    continue;
                }
                throw switchError;
            }
        }

        let accountAttempts = 0;
        while (accountAttempts < maxRetries) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (!accounts || accounts.length === 0) {
                    throw new Error('No accounts returned by MetaMask');
                }
                userAccount = accounts[0];
                break;
            } catch (accountError) {
                if (accountError.message.includes('network error') && accountAttempts < maxRetries - 1) {
                    console.warn(`Account request failed, retrying (${accountAttempts + 1}/${maxRetries})...`);
                    accountAttempts++;
                    await new Promise(resolve => setTimeout(resolve, 3000)); // Increased delay
                    continue;
                }
                throw accountError;
            }
        }

        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        console.log('Connected account:', userAccount);
        console.log('Contract initialized:', !!contract);
        await updateUI();
        window.ethereum.on('error', async (error) => {
            console.error('MetaMask provider error:', error);
            console.log('Current RPC:', web3.currentProvider.host);
            if (rpcIndex < RPC_URLS.length - 1) {
                console.log(`Switching to fallback RPC: ${RPC_URLS[rpcIndex + 1]}`);
                web3.setProvider(new Web3.providers.HttpProvider(RPC_URLS[rpcIndex + 1]));
                contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
                await updateUI();
            }
        });

        return true;
    } catch (error) {
        console.error(`Error initializing Web3:`, error);
        if (rpcIndex < RPC_URLS.length - 1) {
            console.log(`Retrying with next RPC: ${RPC_URLS[rpcIndex + 1]}`);
            await new Promise(resolve => setTimeout(resolve, 3000)); // Increased delay
            return await initWeb3(rpcIndex + 1, maxRetries);
        }
        const message = `Failed to connect to MetaMask or RPC endpoints: ${error.message}. Please check your MetaMask connection and try again.`;
        alert(message);
        console.error('All RPC endpoints failed:', RPC_URLS);
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
    return memberNames[address?.toLowerCase()] || truncateAddress(address);
}

async function loadBlockiesScript() {
    if (typeof makeBlockie === 'function') {
        console.log('Blockies library already loaded');
        return true;
    }
    return new Promise((resolve) => {
        const localScript = document.createElement('script');
        localScript.src = 'js/ethereum-blockies-base64.min.js';
        localScript.onload = () => {
            console.log('Blockies loaded from local file');
            resolve(true);
        };
        localScript.onerror = () => {
            console.warn('Local Blockies file failed, trying primary CDN');
            const primaryCDN = 'https://cdn.jsdelivr.net/npm/ethereum-blockies-base64@0.1.0/dist/ethereum-blockies-base64.min.js';
            const fallbackCDN = 'https://unpkg.com/ethereum-blockies-base64@0.1.0/dist/ethereum-blockies-base64.min.js';
            const script = document.createElement('script');
            script.src = primaryCDN;
            script.onload = () => {
                console.log('Blockies loaded from primary CDN');
                resolve(true);
            };
            script.onerror = () => {
                console.warn('Primary Blockies CDN failed, trying fallback CDN');
                script.src = fallbackCDN;
                script.onload = () => {
                    console.log('Blockies loaded from fallback CDN');
                    resolve(true);
                };
                script.onerror = () => {
                    console.error('Fallback Blockies CDN failed');
                    resolve(false);
                };
                document.head.appendChild(script);
            };
            document.head.appendChild(script);
        };
        document.head.appendChild(localScript);
    });
}

async function createBlockie(address, size = 32, initial = '') {
    try {
        const blockiesLoaded = await loadBlockiesScript();
        if (!blockiesLoaded || typeof makeBlockie !== 'function') {
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
        const blockie = await makeBlockie(address || '0x0', { size: 8, scale: size / 8 });
        return blockie;
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
            const message = isMobileDevice()
                ? 'Please open this page in the MetaMask in-app browser or ensure MetaMask is installed and accessible. <a href="metamask://dapp/www.splitbillez.com">Open in MetaMask</a>'
                : 'MetaMask not detected. Please install MetaMask and refresh.';
            console.log(message);
            if (document.getElementById('dashboardContent')) {
                document.getElementById('dashboardContent').innerHTML = message;
            } else if (document.getElementById('expenseMessage')) {
                document.getElementById('expenseMessage').innerHTML = message;
            }
            if (isMobileDevice()) {
                document.body.innerHTML += '<div style="text-align: center; margin-top: 20px;"><a href="metamask://dapp/www.splitbillez.com">Open in MetaMask</a></div>';
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
        const message = 'Error checking MetaMask connection: ' + error.message + '. Please refresh and reconnect MetaMask.';
        if (document.getElementById('dashboardContent')) {
            document.getElementById('dashboardContent').innerHTML = message;
        } else if (document.getElementById('expenseMessage')) {
            document.getElementById('expenseMessage').textContent = message;
        }
    }
}

async function getDebtAmount(groupId, toAddress) {
    try {
        const userAddress = await getAccount();
        const balanceData = await getContract().methods.getGroupBalances(groupId).call();
        const balMembers = balanceData.members || balanceData[0] || [];
        const balances = balanceData.bals || balanceData[1] || [];
        const userIndex = balMembers.findIndex(addr => addr.toLowerCase() === userAddress.toLowerCase());
        const toIndex = balMembers.findIndex(addr => addr.toLowerCase() === toAddress.toLowerCase());
        if (userIndex === -1 || toIndex === -1) {
            console.log(`User ${userAddress} or recipient ${toAddress} not found in group ${groupId}`);
            return '0';
        }
        const userBalance = parseFloat(web3.utils.fromWei(balances[userIndex] || '0', 'ether'));
        const toBalance = parseFloat(web3.utils.fromWei(balances[toIndex] || '0', 'ether'));
        if (userBalance <= 0) {
            console.log(`User ${userAddress} has non-positive balance (${userBalance} SHM) in group ${groupId}`);
            return '0';
        }
        if (toBalance >= 0) {
            console.log(`Recipient ${toAddress} has non-negative balance (${toBalance} SHM) in group ${groupId}`);
            return '0';
        }
        const debtAmount = Math.min(userBalance, Math.abs(toBalance));
        console.log(`Calculated debt for group ${groupId}: ${userAddress} owes ${toAddress} ${debtAmount} SHM`);
        return debtAmount.toFixed(2);
    } catch (error) {
        console.error(`Error calculating debt for group ${groupId}, to ${toAddress}:`, error);
        return '0';
    }
}

async function calculateContributionBreakdown(groupId, members, expenses) {
    try {
        const breakdown = members.map(member => ({
            address: member,
            name: getMemberName(member),
            totalPaid: 0,
            fairShare: 0,
            netBalance: 0
        }));

        for (const expense of expenses) {
            const amount = parseFloat(expense.amount) || 0;
            const payerIndex = breakdown.findIndex(b => b.address.toLowerCase() === expense.payer.toLowerCase());
            if (payerIndex !== -1) {
                breakdown[payerIndex].totalPaid += amount;
            }

            let shares;
            if (expense.splitType === 'custom' && expense.customShares) {
                shares = expense.customShares.map(s => parseInt(s) / 100);
            } else {
                shares = members.map(() => 1 / members.length);
            }

            members.forEach((member, i) => {
                const memberIndex = breakdown.findIndex(b => b.address.toLowerCase() === member.toLowerCase());
                if (memberIndex !== -1) {
                    breakdown[memberIndex].fairShare += amount * shares[i];
                }
            });
        }

        const balanceData = await getContract().methods.getGroupBalances(groupId).call();
        const balMembers = balanceData.members || balanceData[0] || [];
        const balances = balanceData.bals || balanceData[1] || [];
        breakdown.forEach(b => {
            const balIndex = balMembers.findIndex(addr => addr.toLowerCase() === b.address.toLowerCase());
            if (balIndex !== -1) {
                b.netBalance = parseFloat(web3.utils.fromWei(balances[balIndex] || '0', 'ether'));
            }
            b.totalPaid = parseFloat(b.totalPaid.toFixed(2));
            b.fairShare = parseFloat(b.fairShare.toFixed(2));
            b.netBalance = parseFloat(b.netBalance.toFixed(2));
        });

        return breakdown;
    } catch (error) {
        console.error(`Error calculating contribution breakdown for group ${groupId}:`, error);
        return members.map(member => ({
            address: member,
            name: getMemberName(member),
            totalPaid: 0,
            fairShare: 0,
            netBalance: 0
        }));
    }
}

async function getSettlementLines(groupId, members, balances) {
    try {
        const userAddress = await getAccount();
        console.log(`Calculating settlements for group ${groupId}, members:`, members, 'balances:', balances);
        const lines = [];
        for (let i = 0; i < members.length; i++) {
            const from = members[i].toLowerCase();
            const balance = parseFloat(web3.utils.fromWei(balances[i] || '0', 'ether'));
            if (balance <= 0) continue; // Skip members who don't owe anything
            for (let j = 0; j < members.length; j++) {
                if (i === j) continue; // Skip self
                const to = members[j].toLowerCase();
                const toBalance = parseFloat(web3.utils.fromWei(balances[j] || '0', 'ether'));
                if (toBalance >= 0) continue; // Skip members who aren't owed
                const debt = Math.min(balance, Math.abs(toBalance));
                if (debt > 0.01) { // Threshold to avoid negligible debts
                    lines.push({
                        from: members[i],
                        to: members[j],
                        amount: debt.toFixed(2),
                        fromName: getMemberName(members[i]),
                        toName: getMemberName(members[j]),
                        fromAddr: members[i],
                        toAddr: members[j]
                    });
                    console.log(`Settlement line: ${getMemberName(members[i])} (${members[i]}) owes ${getMemberName(members[j])} (${members[j]}) ${debt.toFixed(2)} SHM`);
                }
            }
        }
        console.log(`Settlement lines for group ${groupId}:`, lines);
        return lines;
    } catch (error) {
        console.error(`Error calculating settlement lines for group ${groupId}:`, error);
        return [];
    }
}

function getSettlementHistory(groupId) {
    const history = JSON.parse(localStorage.getItem(`settlementHistory_${groupId}`) || '[]');
    return history;
}

function addSettlementToHistory(groupId, fromAddr, toAddr, amount) {
    const history = getSettlementHistory(groupId);
    const timestamp = new Date().toLocaleString();
    history.push({
        timestamp,
        fromAddr,
        toAddr,
        amount,
        fromName: getMemberName(fromAddr),
        toName: getMemberName(toAddr)
    });
    localStorage.setItem(`settlementHistory_${groupId}`, JSON.stringify(history));
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
        // Primary scan: userGroups array
        for (let i = 0; i < Math.min(groupCount, 50); i++) {
            try {
                const groupId = await getContract().methods.userGroups(userAddress, i).call();
                if (groupId && parseInt(groupId) > 0) {
                    groupIds.add(groupId.toString());
                    console.log(`Added groupId ${groupId} at index ${i} from userGroups`);
                }
            } catch (error) {
                console.log(`userGroups[${i}] reverted or empty, skipping`);
                if (error.message.includes('execution reverted')) {
                    break;
                }
            }
        }
        // Enhanced fallback: Scan all groups and check membership
        console.log('Running enhanced fallback scan for all groups...');
        for (let i = 1; i <= groupCount; i++) {
            try {
                const result = await getContract().methods.getGroup(i).call();
                const members = result.members || result[1] || [];
                if (members && Array.isArray(members) && members.map(addr => addr.toLowerCase()).includes(userAddress.toLowerCase())) {
                    groupIds.add(i.toString());
                    console.log(`Added groupId ${i} from fallback scan (user is member)`);
                }
            } catch (error) {
                console.log(`Group ${i} does not exist or access denied`);
            }
        }
        console.log('Final group IDs found:', Array.from(groupIds));
        if (groupIds.size === 0) {
            dashboardContent.innerHTML = '<p>No groups found for this account. Create one in the Add Expense page or verify your MetaMask account.</p>';
            return;
        }
        dashboardContent.innerHTML = '';
        for (let groupId of groupIds) {
            try {
                const result = await getContract().methods.getGroup(groupId).call();
                const name = result.name || result[0] || 'Unnamed Group';
                const members = result.members || result[1] || [];
                if (!members || !Array.isArray(members)) {
                    console.warn(`Group ${groupId} has invalid members array:`, members);
                    continue;
                }
                const groupBlockie = await createBlockie(groupId.toString(), 64);
                const memberAvatars = await Promise.all(
                    members.map(async addr => {
                        const initial = getMemberName(addr)[0].toUpperCase();
                        return {
                            addr,
                            name: getMemberName(addr),
                            avatar: await createBlockie(addr, 32, initial)
                        };
                    })
                );
                const balanceData = await getContract().methods.getGroupBalances(groupId).call();
                const balMembers = balanceData.members || balanceData[0] || [];
                const balances = balanceData.bals || balanceData[1] || [];
                const balanceAvatars = await Promise.all(
                    balMembers.map(async addr => ({
                        addr,
                        name: getMemberName(addr),
                        avatar: await createBlockie(addr, 32, getMemberName(addr)[0].toUpperCase())
                    }))
                );
                const expenseIds = await getContract().methods.getGroupExpenseIds(groupId).call();
                console.log(`Group ${groupId} expense IDs:`, expenseIds);
                const groupExpenses = await Promise.all(
                    expenseIds.map(async expenseId => {
                        try {
                            const expense = await getContract().methods.getExpense(expenseId).call();
                            const block = await web3.eth.getBlock('latest');
                            return {
                                id: expenseId,
                                description: expense.description || 'No description',
                                amount: web3.utils.fromWei(expense.amount || '0', 'ether'),
                                payer: expense.payer || 'Unknown',
                                splitType: expense.splitType || 'Unknown',
                                customShares: expense.customShares || [],
                                timestamp: block ? new Date(block.timestamp * 1000).toLocaleString() : 'N/A'
                            };
                        } catch (error) {
                            console.error(`Error fetching expense ${expenseId} for group ${groupId}:`, error);
                            return null;
                        }
                    })
                ).then(results => results.filter(exp => exp !== null));
                const contributionBreakdown = await calculateContributionBreakdown(groupId, members, groupExpenses);
                const settlementLines = await getSettlementLines(groupId, balMembers, balances);
                const settlementHistory = getSettlementHistory(groupId);
                const groupDiv = document.createElement('div');
                groupDiv.className = 'group';
                groupDiv.innerHTML = `
                    <div class="group-header">
                        <img src="${groupBlockie}" alt="Group ${groupId} Avatar" class="group-avatar">
                        <h3>${name} (ID: ${groupId})</h3>
                    </div>
                    <p><strong>Members:</strong></p>
                    <div class="members-container">
                        ${memberAvatars.map(({ name, avatar, addr }) => `
                            <span class="member-item">
                                <img src="${avatar}" class="member-avatar" alt="${name} Avatar">
                                <span class="member-name">${name} (${addr.slice(0, 7)})</span>
                            </span>
                        `).join('')}
                    </div>
                    <h4>Expenses:</h4>
                    <div class="expenses-placeholder">Loading expenses...</div>
                    <h4>Who Owes Whom:</h4>
                    <div class="settlement-container">
                        ${settlementLines.length > 0 ? settlementLines.map(line => `
                            <div class="settlement-line ${line.amount > 0 ? (line.toAddr.toLowerCase() === userAddress.toLowerCase() ? 'positive' : 'negative') : 'settled'}" data-from="${line.fromAddr}" data-to="${line.toAddr}" data-amount="${line.amount}">
                                <span class="settlement-icon">${line.amount > 0 ? (line.toAddr.toLowerCase() === userAddress.toLowerCase() ? '↑' : '↓') : ''}</span>
                                <span>${line.fromName} (${line.fromAddr.slice(0, 7)}) → ${line.toName} (${line.toAddr.slice(0, 7)}): ${line.amount} SHM</span>
                                ${line.amount > 0 ? '<button class="mark-paid-button">Mark as Paid</button>' : ''}
                            </div>
                        `).join('') : '<p>No settlements needed.</p>'}
                    </div>
                    <h4>Contribution Breakdown:</h4>
                    <table class="contribution-table">
                        <thead>
                            <tr>
                                <th>Member</th>
                                <th>Total Paid (SHM)</th>
                                <th>Fair Share (SHM)</th>
                                <th>Net Balance (SHM)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${contributionBreakdown.map(b => `
                                <tr>
                                    <td>
                                        <img src="${balanceAvatars.find(ba => ba.addr.toLowerCase() === b.address.toLowerCase())?.avatar || createBlockie(b.address, 32, b.name[0].toUpperCase())}" class="balance-avatar" alt="${b.name} Avatar">
                                        ${b.name} (${b.address.slice(0, 7)})
                                    </td>
                                    <td>${b.totalPaid.toFixed(2)}</td>
                                    <td>${b.fairShare.toFixed(2)}</td>
                                    <td class="${b.netBalance > 0 ? 'positive' : b.netBalance < 0 ? 'negative' : 'settled'}">
                                        <span class="settlement-icon">${b.netBalance > 0 ? '↑' : b.netBalance < 0 ? '↓' : ''}</span>
                                        ${b.netBalance.toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="4">
                                        <div class="progress-container">
                                            <div class="progress-bar" style="width: ${(b.totalPaid / (b.fairShare || 1)) * 100}%"></div>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <h4>Settlement History:</h4>
                    <div class="history-toggle" data-group-id="${groupId}">Show Settlement History</div>
                    <div class="history-log" id="history-log-${groupId}">
                        ${settlementHistory.length > 0 ? settlementHistory.map(h => `
                            <div class="history-item">${h.timestamp}: ${h.fromName} (${h.fromAddr.slice(0, 7)}) paid ${h.toName} (${h.toAddr.slice(0, 7)}) ${h.amount} SHM</div>
                        `).join('') : '<p>No settlement history.</p>'}
                    </div>
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
                        <input type="number" id="settleAmount-${groupId}" placeholder="Select a member to calculate" step="0.01" required>
                        <button type="submit" class="submit-group">Settle Debt</button>
                    </form>
                    <p id="settleMessage-${groupId}"></p>
                `;
                dashboardContent.appendChild(groupDiv);
                const expenseAvatars = await Promise.all(
                    groupExpenses.map(async exp => ({
                        ...exp,
                        avatar: await createBlockie(exp.payer, 32, getMemberName(exp.payer)[0].toUpperCase())
                    }))
                );
                const expenseElements = expenseAvatars.map(exp => `
                    <div class="expense-item">
                        <img src="${exp.avatar}" class="expense-avatar" alt="${getMemberName(exp.payer)} Avatar">
                        <span class="member-name">Expense ${exp.id}: ${exp.description} - ${exp.amount} SHM (Payer: ${getMemberName(exp.payer)} (${exp.payer.slice(0, 7)}), Split: ${exp.splitType}, Date: ${exp.timestamp})</span>
                    </div>
                `);
                const expensesHTML = expenseElements.length > 0 ? expenseElements.join('') : '<p>No expenses found.</p>';
                groupDiv.querySelector('.expenses-placeholder').outerHTML = expensesHTML;
                const settleForm = document.getElementById(`settleDebtForm-${groupId}`);
                const settleToSelect = document.getElementById(`settleTo-${groupId}`);
                const settleAmountInput = document.getElementById(`settleAmount-${groupId}`);
                settleToSelect.addEventListener('change', async () => {
                    const toAddress = settleToSelect.value;
                    if (toAddress) {
                        const debtAmount = await getDebtAmount(groupId, toAddress);
                        settleAmountInput.value = debtAmount !== '0' ? parseFloat(debtAmount).toFixed(2) : '';
                        settleAmountInput.placeholder = debtAmount !== '0' ? `Owe ${parseFloat(debtAmount).toFixed(2)} SHM` : 'No debt to settle';
                    } else {
                        settleAmountInput.value = '';
                        settleAmountInput.placeholder = 'Select a member to calculate';
                    }
                });
                settleForm.addEventListener('submit', async function(e) {
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
                            gasPrice: web3.utils.toWei('50', 'gwei')
                        });
                        settleMessage.textContent = 'Debt settled! Transaction: https://explorer-unstable.shardeum.org/tx/' + tx.transactionHash;
                        addSettlementToHistory(settleGroupId, userAddress, toAddress, amountInput);
                        this.reset();
                        await populateDashboard();
                    } catch (error) {
                        console.error(`Debt settlement error for group ${settleGroupId}:`, error);
                        settleMessage.textContent = 'Error: ' + (error.message.includes('revert') ? 'Invalid input or insufficient debt. Check inputs and try again.' : error.message);
                    }
                });
                const historyToggle = groupDiv.querySelector(`.history-toggle[data-group-id="${groupId}"]`);
                const historyLog = document.getElementById(`history-log-${groupId}`);
                historyToggle.addEventListener('click', () => {
                    historyLog.classList.toggle('active');
                    historyToggle.textContent = historyLog.classList.contains('active') ? 'Hide Settlement History' : 'Show Settlement History';
                });
                const markPaidButtons = groupDiv.querySelectorAll('.mark-paid-button');
                markPaidButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const settlementLine = button.parentElement;
                        const fromAddr = settlementLine.dataset.from;
                        const toAddr = settlementLine.dataset.to;
                        const amount = settlementLine.dataset.amount;
                        addSettlementToHistory(groupId, fromAddr, toAddr, amount);
                        settlementLine.classList.add('settled');
                        settlementLine.querySelector('.settlement-icon').textContent = '';
                        button.classList.add('disabled');
                        button.disabled = true;
                        button.textContent = 'Paid';
                        populateDashboard();
                    });
                });
            } catch (error) {
                console.error(`Error processing group ${groupId}:`, error);
            }
        }
    } catch (error) {
        console.error('Error populating dashboard:', error);
        dashboardContent.innerHTML = '<p>Error loading groups: ' + error.message + '. Please check your MetaMask connection and try again.</p>';
    }
}

async function fetchShmPrice() {
    const cacheKeyPrefix = 'shmPriceCache_';
    const cacheTimestampKeyPrefix = 'shmPriceTimestamp_';
    const cacheDuration = 10 * 60 * 1000; // 10 minutes
    const now = Date.now();
    const currencies = ['usd', 'eur', 'inr', 'shm'];
    shmPrice = shmPrice || {};

    for (const currency of currencies) {
        const cacheKey = cacheKeyPrefix + currency;
        const cacheTimestampKey = cacheTimestampKeyPrefix + currency;
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTimestamp = localStorage.getItem(cacheTimestampKey);

        if (cachedData && cachedTimestamp && (now - parseInt(cachedTimestamp)) < cacheDuration) {
            console.log(`Using cached SHM price for ${currency}:`, JSON.parse(cachedData));
            shmPrice[currency] = JSON.parse(cachedData);
            continue;
        }

        try {
            if (currency === 'shm') {
                shmPrice[currency] = 1;
                console.log(`Set SHM price for ${currency}:`, 1);
            } else {
                console.log(`Fetching SHM price for ${currency} from CoinGecko`);
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=shardeum&vs_currencies=' + currency);
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status + ': ' + response.statusText);
                }
                const data = await response.json();
                const price = data.shardeum?.[currency];
                if (price === undefined) {
                    throw new Error('SHM price not found in response');
                }
                shmPrice[currency] = price;
                console.log(`Fetched SHM price for ${currency}:`, price);
            }
            localStorage.setItem(cacheKey, JSON.stringify(shmPrice[currency]));
            localStorage.setItem(cacheTimestampKey, now.toString());
        } catch (error) {
            console.error(`Error fetching SHM price for ${currency}:`, error);
            shmPrice[currency] = currency === 'shm' ? 1 : (currency === 'usd' ? 0.11 : currency === 'eur' ? 0.1 : 9.0);
            localStorage.setItem(cacheKey, JSON.stringify(shmPrice[currency]));
            localStorage.setItem(cacheTimestampKey, now.toString());
            console.log(`Using fallback SHM price for ${currency}:`, shmPrice[currency]);
        }
    }

    const shmAmountElement = document.getElementById('shmAmount');
    if (shmAmountElement) {
        if (Object.keys(shmPrice).length > 0) {
            shmAmountElement.textContent = 'SHM Amount: Ready (fetched prices)';
            let refreshBtn = document.getElementById('refreshPriceBtn');
            if (!refreshBtn) {
                refreshBtn = document.createElement('button');
                refreshBtn.id = 'refreshPriceBtn';
                refreshBtn.textContent = '↻';
                refreshBtn.type = 'button';
                refreshBtn.style.marginLeft = '5px';
                refreshBtn.style.padding = '2px 6px';
                refreshBtn.style.fontSize = '12px';
                refreshBtn.style.backgroundColor = '#007bff';
                refreshBtn.style.color = 'white';
                refreshBtn.style.border = 'none';
                refreshBtn.style.borderRadius = '3px';
                refreshBtn.style.cursor = 'pointer';
                refreshBtn.style.verticalAlign = 'middle';
                refreshBtn.title = 'Refresh SHM Price';
                refreshBtn.onclick = fetchShmPrice;
                shmAmountElement.insertAdjacentElement('afterend', refreshBtn);
            }
        } else {
            shmAmountElement.textContent = 'Error fetching SHM price. Using defaults. Check console.';
        }
    }
    updateShmAmount();
}

function updateShmAmount() {
    const amountInput = document.getElementById('amount');
    const currency = document.getElementById('currency');
    const shmAmountElement = document.getElementById('shmAmount');
    if (!shmAmountElement || !amountInput || !currency) return;
    if (!shmPrice || !amountInput.value) {
        shmAmountElement.textContent = 'SHM Amount: Enter amount to calculate';
        return;
    }
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        shmAmountElement.textContent = 'SHM Amount: Enter a valid amount';
        return;
    }
    const selectedCurrency = currency.value.toLowerCase();
    let shmAmount;
    if (selectedCurrency === 'shm') {
        shmAmount = amount;
    } else {
        const price = shmPrice[selectedCurrency];
        if (price === undefined || price <= 0) {
            console.error('Invalid SHM price for currency:', selectedCurrency);
            shmAmountElement.textContent = 'Error: Invalid price data. Refresh price.';
            return;
        }
        shmAmount = amount / price;
    }
    shmAmountElement.textContent = 'SHM Amount: ' + shmAmount.toFixed(4) + ' SHM';
    console.log(`Calculated SHM: ${amount} ${selectedCurrency.toUpperCase()} = ${shmAmount.toFixed(4)} SHM (price: ${shmPrice[selectedCurrency]})`);
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
        expenseMessage.textContent = 'Please connect MetaMask to load groups.';
        return;
    }
    try {
        const userAddress = await getAccount();
        console.log('Fetching groups for:', userAddress);
        document.getElementById('userAddress').value = userAddress;
        const groupCount = parseInt(await getContract().methods.groupCount().call()) || 0;
        console.log('Total group count from contract:', groupCount);
        const groupIds = new Set();
        // Primary scan: userGroups array
        for (let i = 0; i < Math.min(groupCount, 50); i++) {
            try {
                const groupId = await getContract().methods.userGroups(userAddress, i).call();
                if (groupId && parseInt(groupId) > 0) {
                    groupIds.add(groupId.toString());
                    console.log(`Added groupId ${groupId} at index ${i} from userGroups`);
                }
            } catch (error) {
                console.log(`userGroups[${i}] reverted or empty, skipping`);
                if (error.message.includes('execution reverted')) {
                    break;
                }
            }
        }
        // Enhanced fallback: Scan all groups and check membership
        console.log('Running enhanced fallback scan for all groups...');
        for (let i = 1; i <= groupCount; i++) {
            try {
                const result = await getContract().methods.getGroup(i).call();
                const members = result.members || result[1] || [];
                if (members && Array.isArray(members) && members.map(addr => addr.toLowerCase()).includes(userAddress.toLowerCase())) {
                    groupIds.add(i.toString());
                    console.log(`Added groupId ${i} from fallback scan (user is member)`);
                }
            } catch (error) {
                console.log(`Group ${i} does not exist or access denied`);
            }
        }
        console.log('Final group IDs found:', Array.from(groupIds));
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
                    const name = result.name || result[0] || 'Unnamed Group';
                    const option = document.createElement('option');
                    option.value = groupId;
                    option.textContent = name + ' (ID: ' + groupId + ')';
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
        expenseMessage.textContent = 'Error loading groups: ' + error.message + '. Please check your MetaMask connection and try again.';
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
    console.log('Expense form submitted');
    const expenseMessage = document.getElementById('expenseMessage');
    if (!web3 || !getContract() || !getAccount()) {
        console.error('Web3 not initialized or wallet not connected');
        expenseMessage.textContent = 'Please connect MetaMask first.';
        return;
    }
    const groupId = document.getElementById('groupId')?.value;
    const submitButton = document.getElementById('submitButton');
    const groupCreationDiv = document.getElementById('groupCreation');
    if (!expenseMessage || !submitButton || !groupCreationDiv) {
        console.error('Required form elements not found');
        expenseMessage.textContent = 'Form elements missing. Please refresh the page.';
        return;
    }
    if (groupId === 'create') {
        console.log('Creating new group');
        const groupName = document.getElementById('groupName')?.value;
        const memberInputs = document.getElementsByClassName('member-input');
        if (!groupName) {
            expenseMessage.textContent = 'Please enter a group name.';
            console.error('Group name missing');
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
                if (address && (web3.utils.isAddress(address) || address === userAddress)) {
                    members.push(address);
                    if (name && name !== 'Me') newMemberNames[address] = name;
                }
            }
            if (members.length < 2) {
                expenseMessage.textContent = 'Please include at least two valid Ethereum addresses (including yours).';
                console.error('Insufficient valid members:', members);
                return;
            }
            if (!members.includes(userAddress)) {
                expenseMessage.textContent = 'Your address is missing from the member list.';
                console.error('User address missing from members:', members);
                return;
            }
            const existingNames = JSON.parse(localStorage.getItem('memberNames') || '{}');
            localStorage.setItem('memberNames', JSON.stringify({ ...existingNames, ...newMemberNames }));
            const tx = await getContract().methods.createGroup(groupName, members).send({
                from: await getAccount(),
                value: '0',
                gasPrice: web3.utils.toWei('50', 'gwei')
            });
            expenseMessage.innerHTML = '<strong>Group created successfully!</strong> <a href="https://explorer-unstable.shardeum.org/tx/' + tx.transactionHash + '" target="_blank">View Tx</a>';
            console.log('Group created, tx:', tx.transactionHash);
            setTimeout(function() {
                groupCreationDiv.style.display = 'none';
                submitButton.textContent = 'Add Expense';
                e.target.reset();
                populateGroupDropdown();
                getContract().methods.groupCount().call().then(newGroupId => {
                    document.getElementById('groupId').value = parseInt(newGroupId);
                });
            }, 3000);
        } catch (error) {
            console.error('Group creation error:', error);
            expenseMessage.textContent = 'Error: ' + (error.message.includes('revert') ? 'Invalid input or contract revert. Check addresses and try again.' : error.message);
        }
        return;
    }
    if (!groupId) {
        expenseMessage.textContent = 'Please select a group.';
        console.error('No group selected');
        return;
    }
    const description = document.getElementById('description')?.value;
    const amountInput = document.getElementById('amount')?.value;
    const currency = document.getElementById('currency')?.value;
    let amount;
    try {
        const shmAmount = currency.toLowerCase() === 'shm' ? parseFloat(amountInput) : parseFloat(amountInput) / shmPrice[currency.toLowerCase()];
        amount = web3.utils.toWei(shmAmount.toFixed(18), 'ether');
        console.log('Converted amount:', amountInput, currency, 'to', shmAmount, 'SHM');
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
                console.error('Custom shares sum invalid:', total);
                return;
            }
            const [_, members] = await getContract().methods.getGroup(groupId).call();
            if (customShares.length !== members.length) {
                expenseMessage.textContent = 'Custom shares count (' + customShares.length + ') must match group members (' + members.length + ').';
                console.error('Custom shares count mismatch:', customShares.length, 'vs', members.length);
                return;
            }
        } catch (error) {
            console.error('Error processing custom shares:', error);
            expenseMessage.textContent = 'Invalid custom shares format. Use comma-separated percentages.';
            return;
        }
    }
    let tx;
    try {
        console.log('Submitting expense:', { groupId, description, amount, splitType, customShares });
        tx = await getContract().methods.addExpense(groupId, description, amount, splitType, customShares).send({
            from: await getAccount(),
            value: '0',
            gasPrice: web3.utils.toWei('50', 'gwei')
        });
        expenseMessage.innerHTML = '<strong>Expense added successfully!</strong> <a href="https://explorer-unstable.shardeum.org/tx/' + tx.transactionHash + '" target="_blank">View Tx</a>';
        console.log('Expense added, tx:', tx.transactionHash);
        setTimeout(function() {
            e.target.reset();
            populateDashboard();
        }, 3000);
    } catch (error) {
        console.error('Expense submission error:', error);
        expenseMessage.textContent = 'Error: ' + (error.message.includes('Failed to check for transaction receipt') || error.message.includes('network error') ? 'Failed to connect to Shardeum RPC. Please check your network and try again.' : error.message.includes('revert') ? 'Invalid input or contract revert. Check inputs and try again.' : error.message);
        if (error.message.includes('Failed to check for transaction receipt') || error.message.includes('network error')) {
            if (RPC_URLS.indexOf(web3.currentProvider.host) < RPC_URLS.length - 1) {
                const nextRpcIndex = RPC_URLS.indexOf(web3.currentProvider.host) + 1;
                console.log('Retrying with fallback RPC: ' + RPC_URLS[nextRpcIndex]);
                web3.setProvider(new Web3.providers.HttpProvider(RPC_URLS[nextRpcIndex]));
                contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
                try {
                    tx = await getContract().methods.addExpense(groupId, description, amount, splitType, customShares).send({
                        from: await getAccount(),
                        value: '0',
                        gasPrice: web3.utils.toWei('50', 'gwei')
                    });
                    expenseMessage.innerHTML = '<strong>Expense added successfully (retry)!</strong> <a href="https://explorer-unstable.shardeum.org/tx/' + tx.transactionHash + '" target="_blank">View Tx</a>';
                    console.log('Expense added with fallback RPC, tx:', tx.transactionHash);
                    setTimeout(function() {
                        e.target.reset();
                        populateDashboard();
                    }, 3000);
                } catch (retryError) {
                    console.error('Retry failed with fallback RPC:', retryError);
                    expenseMessage.textContent = 'Error: Failed to add expense after retrying with fallback RPC. Please try again later.';
                }
            } else {
                expenseMessage.textContent = 'Error: All RPC endpoints failed. Please check your network and try again.';
            }
        }
    }
}

function getContract() {
    return contract;
}

async function getAccount() {
    if (!web3 || !window.ethereum) return null;
    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        return accounts[0] || null;
    } catch (error) {
        console.error('Error getting account:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded');
    const metaMaskButton = document.querySelector('.metamask-button');
    if (metaMaskButton) {
        metaMaskButton.addEventListener('click', handleMetaMaskToggle);
    }
    const expenseForm = document.getElementById('expenseForm');
    if (expenseForm) {
        expenseForm.addEventListener('submit', handleExpenseFormSubmit);
        console.log('Expense form listener added');
        const splitSelect = document.getElementById('split');
        if (splitSelect) {
            splitSelect.addEventListener('change', toggleCustomShares);
        }
        const groupSelect = document.getElementById('groupId');
        if (groupSelect) {
            groupSelect.addEventListener('change', toggleGroupCreation);
        }
        const addMemberButton = document.getElementById('addMemberButton');
        if (addMemberButton) {
            addMemberButton.addEventListener('click', addMemberField);
        }
        const amountInput = document.getElementById('amount');
        const currencySelect = document.getElementById('currency');
        if (amountInput && currencySelect) {
            amountInput.addEventListener('input', updateShmAmount);
            currencySelect.addEventListener('change', updateShmAmount);
        }
        if (document.getElementById('shmAmount')) {
            console.log('On add-expense page: Fetching SHM price early');
            await fetchShmPrice();
        }
    }
    await checkMetaMaskConnection();
});