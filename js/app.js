// app.js - Shared Web3 Integration for SplitBillEz
const CONTRACT_ADDRESS = '0x753408c72dd498111157ad747e6e605463b93380';
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
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "groupId", "type": "uint256"}
        ],
        "name": "GroupSettled",
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
            {"internalType": "uint256", "name": "", "type": "uint256"},
            {"internalType": "string", "name": "", "type": "string"},
            {"internalType": "uint256", "name": "", "type": "uint256"},
            {"internalType": "address", "name": "", "type": "address"},
            {"internalType": "string", "name": "", "type": "string"},
            {"internalType": "uint256[]", "name": "", "type": "uint256[]"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_groupId", "type": "uint256"}],
        "name": "getGroup",
        "outputs": [
            {"internalType": "string", "name": "", "type": "string"},
            {"internalType": "address[]", "name": "", "type": "address[]"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_groupId", "type": "uint256"}],
        "name": "getGroupBalances",
        "outputs": [
            {"internalType": "address[]", "name": "", "type": "address[]"},
            {"internalType": "int256[]", "name": "", "type": "int256[]"}
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
        "inputs": [{"internalType": "uint256", "name": "_groupId", "type": "uint256"}],
        "name": "getGroupSettledStatus",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
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
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "name": "isGroupSettled",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
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
    console.log('Initializing Web3 for', isMobileDevice() ? 'mobile' : 'desktop', 'with RPC:', RPC_URLS[rpcIndex]);
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
                    await new Promise(resolve => setTimeout(resolve, 3000));
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
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    continue;
                }
                throw accountError;
            }
        }

        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        console.log('Connected account:', userAccount);
        console.log('Contract initialized:', !!contract);

        // Verify contract initialization
        try {
            await contract.methods.groupCount().call();
            console.log('Contract verification successful');
        } catch (error) {
            console.error('Contract verification failed:', error);
            throw new Error('Failed to verify contract initialization');
        }

        // Listen for GroupSettled events
        contract.events.GroupSettled({
            filter: {},
            fromBlock: 'latest'
        }, (error, event) => {
            if (error) {
                console.error('Error in GroupSettled event listener:', error);
                return;
            }
            console.log(`Group ${event.returnValues.groupId} settled, refreshing dashboard`);
            populateDashboard();
        });

        await updateUI();
        window.ethereum.on('error', async (error) => {
            console.error('MetaMask provider error:', error, 'Current RPC:', web3.currentProvider.host);
            if (rpcIndex < RPC_URLS.length - 1) {
                console.log(`Switching to fallback RPC: ${RPC_URLS[rpcIndex + 1]}`);
                web3.setProvider(new Web3.providers.HttpProvider(RPC_URLS[rpcIndex + 1]));
                contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
                await updateUI();
            }
        });

        return true;
    } catch (error) {
        console.error(`Error initializing Web3 with RPC ${RPC_URLS[rpcIndex]}:`, error);
        if (rpcIndex < RPC_URLS.length - 1) {
            console.log(`Retrying with next RPC: ${RPC_URLS[rpcIndex + 1]}`);
            await new Promise(resolve => setTimeout(resolve, 3000));
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
        if (document.getElementById('expenseForm')) {
            toggleExpenseForm(false);
        }
    } catch (error) {
        console.error('Error disconnecting wallet:', error);
        alert('Failed to disconnect wallet: ' + error.message);
    }
}

async function handleMetaMaskToggle() {
    if (userAccount) {
        await disconnectWallet();
    } else {
        const initialized = await initWeb3();
        if (initialized && document.getElementById('groupId')) {
            await populateGroupDropdown();
        } else if (initialized && document.getElementById('dashboardContent')) {
            await populateDashboard();
        }
    }
}

async function updateUI() {
    const buttons = document.querySelectorAll('.metamask-button');
    buttons.forEach(btn => {
        if (userAccount && contract) {
            btn.textContent = `Disconnect (${userAccount.slice(0,6)}...${userAccount.slice(-4)})`;
            btn.style.backgroundColor = '#28a745';
            btn.disabled = false;
        } else {
            btn.textContent = 'Connect with MetaMask';
            btn.style.backgroundColor = '#28a745';
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

function updateMemberName(address) {
    const currentName = getMemberName(address);
    const newName = prompt(`Enter new name for ${currentName} (${truncateAddress(address)}):`, currentName);
    if (newName && newName.trim() && newName !== currentName) {
        const memberNames = JSON.parse(localStorage.getItem('memberNames') || '{}');
        memberNames[address.toLowerCase()] = newName.trim();
        localStorage.setItem('memberNames', JSON.stringify(memberNames));
        console.log(`Updated name for ${address} to ${newName}`);
        populateDashboard();
    }
}

function getGroupName(groupId) {
    const groupNames = JSON.parse(localStorage.getItem('groupNames') || '{}');
    return groupNames[groupId] || `Unnamed Group`;
}

function updateGroupName(groupId) {
    const currentName = getGroupName(groupId);
    const newName = prompt(`Enter new name for group ${groupId} (current: ${currentName}):`, currentName);
    if (newName && newName.trim() && newName !== currentName) {
        const groupNames = JSON.parse(localStorage.getItem('groupNames') || '{}');
        groupNames[groupId] = newName.trim();
        localStorage.setItem('groupNames', JSON.stringify(groupNames));
        console.log(`Updated name for group ${groupId} to ${newName}`);
        populateDashboard();
        if (document.getElementById('groupId')) {
            populateGroupDropdown();
        }
    }
}

async function isGroupSettled(groupId) {
    try {
        const contractInstance = await getContract();
        if (!contractInstance) {
            console.error('Contract not initialized in isGroupSettled');
            return false;
        }
        const isSettled = await contractInstance.methods.getGroupSettledStatus(groupId).call();
        if (isSettled) {
            const settledGroups = JSON.parse(localStorage.getItem('settledGroups') || '{}');
            settledGroups[groupId] = true;
            localStorage.setItem('settledGroups', JSON.stringify(settledGroups));
        }
        return isSettled;
    } catch (error) {
        console.error(`Error checking settled status for group ${groupId}:`, error);
        return false;
    }
}

async function fetchSettlementHistory(groupId) {
    try {
        const contractInstance = await getContract();
        if (!contractInstance) {
            console.error('Contract not initialized in fetchSettlementHistory');
            return [];
        }
        const events = await contractInstance.getPastEvents('DebtSettled', {
            filter: { groupId },
            fromBlock: 0,
            toBlock: 'latest'
        });
        const settlements = await Promise.all(events.map(async event => {
            const block = await web3.eth.getBlock(event.blockNumber);
            return {
                from: event.returnValues.from,
                to: event.returnValues.to,
                amount: parseFloat(web3.utils.fromWei(event.returnValues.amount, 'ether')).toFixed(2),
                txHash: event.transactionHash,
                timestamp: block ? new Date(block.timestamp * 1000).toLocaleString() : 'N/A'
            };
        }));
        console.log(`Settlement history for group ${groupId}:`, settlements);
        return settlements;
    } catch (error) {
        console.error(`Error fetching settlement history for group ${groupId}:`, error);
        return [];
    }
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
                document.getElementById('expenseMessage').classList.add('success');
            }
            toggleExpenseForm(false);
            return;
        }
        console.log('MetaMask provider detected');
        if (!web3 || !contract) {
            console.log('Initializing Web3...');
            const initialized = await initWeb3();
            if (!initialized) {
                throw new Error('Web3 initialization failed');
            }
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
                document.getElementById('expenseMessage').classList.add('success');
                toggleExpenseForm(false);
            }
        }
    } catch (error) {
        console.error('Error checking MetaMask connection:', error);
        const message = 'Error connecting to MetaMask or blockchain network: ' + error.message + '. Please refresh and reconnect MetaMask.';
        if (document.getElementById('dashboardContent')) {
            document.getElementById('dashboardContent').innerHTML = message;
        } else if (document.getElementById('expenseMessage')) {
            document.getElementById('expenseMessage').textContent = message;
            document.getElementById('expenseMessage').classList.add('success');
        }
        toggleExpenseForm(false);
    }
}

async function getAccount() {
    if (!web3 || !window.ethereum) return null;
    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        userAccount = accounts[0] || null;
        return userAccount;
    } catch (error) {
        console.error('Error getting account:', error);
        return null;
    }
}

async function getContract() {
    if (!web3) {
        console.error('Web3 not initialized in getContract');
        return null;
    }
    if (!contract) {
        try {
            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            console.log('Contract initialized in getContract:', !!contract);
            await contract.methods.groupCount().call();
        } catch (error) {
            console.error('Error initializing contract in getContract:', error);
            contract = null;
            return null;
        }
    }
    return contract;
}

async function toggleExpenseForm(enable) {
    const expenseFields = document.getElementById('expenseFields');
    const submitButton = document.getElementById('submitButton');
    if (!expenseFields || !submitButton) return;
    if (enable) {
        expenseFields.classList.remove('disabled-form');
        submitButton.textContent = 'Add Expense';
    } else {
        expenseFields.classList.add('disabled-form');
        submitButton.textContent = 'Create Group';
    }
}

async function populateGroupDropdown() {
    const groupSelect = document.getElementById('groupId');
    const expenseMessage = document.getElementById('expenseMessage');
    if (!groupSelect || !expenseMessage) return;

    groupSelect.innerHTML = '<option value="" disabled selected>Loading groups...</option>';
    try {
        const account = await getAccount();
        if (!account) {
            groupSelect.innerHTML = '<option value="" disabled selected>Connect MetaMask to load groups</option>';
            toggleExpenseForm(false);
            expenseMessage.textContent = 'Please connect MetaMask to load groups.';
            expenseMessage.classList.add('success');
            return;
        }

        const contractInstance = await getContract();
        if (!contractInstance) {
            groupSelect.innerHTML = '<option value="" disabled selected>Error loading contract</option>';
            toggleExpenseForm(false);
            expenseMessage.textContent = 'Error: Unable to connect to blockchain contract. Please check your MetaMask connection.';
            expenseMessage.classList.add('success');
            return;
        }

        const groupCount = parseInt(await contractInstance.methods.groupCount().call()) || 0;
        const groups = [];
        for (let i = 1; i <= groupCount; i++) {
            try {
                const group = await contractInstance.methods.getGroup(i).call();
                const members = group[1] || [];
                if (members.some(addr => addr.toLowerCase() === account.toLowerCase())) {
                    const isSettled = await isGroupSettled(i);
                    groups.push({ id: i, name: getGroupName(i), settled: isSettled });
                }
            } catch (error) {
                console.error(`Error fetching group ${i}:`, error);
            }
        }

        groupSelect.innerHTML = '';
        if (groups.length === 0) {
            groupSelect.innerHTML = '<option value="" disabled selected>No groups found</option><option value="create">Create a new group</option>';
            toggleExpenseForm(false);
            document.getElementById('groupCreation').style.display = 'block';
            expenseMessage.textContent = 'No groups found. Please create a new group.';
            expenseMessage.classList.add('success');
        } else {
            groups.forEach(group => {
                const option = document.createElement('option');
                option.value = group.id;
                option.textContent = `${group.name} (${group.id})${group.settled ? ' (Settled)' : ''}`;
                groupSelect.appendChild(option);
            });
            const createOption = document.createElement('option');
            createOption.value = 'create';
            createOption.textContent = 'Create a new group';
            groupSelect.appendChild(createOption);
            toggleExpenseForm(true);
            expenseMessage.textContent = '';
            expenseMessage.classList.remove('success');
        }
    } catch (error) {
        console.error('Error populating group dropdown:', error);
        groupSelect.innerHTML = '<option value="" disabled selected>Error loading groups</option>';
        toggleExpenseForm(false);
        expenseMessage.textContent = 'Error loading groups: ' + error.message;
        expenseMessage.classList.add('success');
    }
}

async function toggleGroupCreation() {
    const groupId = document.getElementById('groupId')?.value;
    const groupCreation = document.getElementById('groupCreation');
    const expenseFields = document.getElementById('expenseFields');
    const submitButton = document.getElementById('submitButton');
    if (!groupCreation || !expenseFields || !submitButton) return;

    if (groupId === 'create') {
        groupCreation.style.display = 'block';
        toggleExpenseForm(false);
    } else {
        groupCreation.style.display = 'none';
        toggleExpenseForm(true);
    }
}

async function handleExpenseFormSubmit(e) {
    e.preventDefault();
    const groupId = document.getElementById('groupId')?.value;
    const expenseMessage = document.getElementById('expenseMessage');
    if (!expenseMessage) return;

    try {
        const contractInstance = await getContract();
        if (!contractInstance) {
            expenseMessage.textContent = 'Error: Unable to connect to blockchain contract. Please check your MetaMask connection.';
            expenseMessage.classList.add('success');
            return;
        }

        if (groupId === 'create') {
            const groupName = document.getElementById('groupName')?.value?.trim();
            if (!groupName) {
                expenseMessage.textContent = 'Please enter a group name.';
                expenseMessage.classList.add('success');
                return;
            }
            const members = Array.from(document.querySelectorAll('#memberInputs .member-address'))
                .map(input => input.value?.trim())
                .filter(address => web3.utils.isAddress(address));
            if (members.length < 2) {
                expenseMessage.textContent = 'Please add at least one other valid member address.';
                expenseMessage.classList.add('success');
                return;
            }
            const account = await getAccount();
            if (!account) {
                expenseMessage.textContent = 'Error: No account connected. Please reconnect MetaMask.';
                expenseMessage.classList.add('success');
                return;
            }
            if (!members.includes(account)) {
                members.unshift(account);
            }
            const tx = await contractInstance.methods.createGroup(groupName, members).send({
                from: account,
                value: '0',
                gasPrice: web3.utils.toWei('50', 'gwei')
            });
            const newGroupId = parseInt(await contractInstance.methods.groupCount().call());
            const groupNames = JSON.parse(localStorage.getItem('groupNames') || '{}');
            groupNames[newGroupId] = groupName;
            localStorage.setItem('groupNames', JSON.stringify(groupNames));
            expenseMessage.innerHTML = `<strong>Group created successfully!</strong> Select group ID ${newGroupId} to add expenses. <a href="https://explorer-unstable.shardeum.org/tx/${tx.transactionHash}" target="_blank">View Tx</a>`;
            expenseMessage.classList.add('success');
            setTimeout(() => {
                e.target.reset();
                populateGroupDropdown();
                document.getElementById('groupId').value = newGroupId;
                toggleGroupCreation();
            }, 3000);
        } else {
            if (!groupId) {
                expenseMessage.textContent = 'Please select a valid group to add an expense.';
                expenseMessage.classList.add('success');
                return;
            }
            const isSettled = await isGroupSettled(groupId);
            if (isSettled) {
                expenseMessage.textContent = 'This group is settled and cannot accept new expenses.';
                expenseMessage.classList.add('success');
                return;
            }
            const description = document.getElementById('description')?.value?.trim();
            if (!description) {
                expenseMessage.textContent = 'Please enter a description for the expense.';
                expenseMessage.classList.add('success');
                return;
            }
            const amountInput = document.getElementById('amount')?.value;
            if (!amountInput || isNaN(parseFloat(amountInput))) {
                expenseMessage.textContent = 'Please enter a valid amount.';
                expenseMessage.classList.add('success');
                return;
            }
            const currency = document.getElementById('currency')?.value.toLowerCase();
            const splitType = document.getElementById('split')?.value;
            let customShares = [];
            let amount = web3.utils.toWei(
                (currency === 'shm' ? parseFloat(amountInput) : parseFloat(amountInput) / shmPrice[currency]).toFixed(18),
                'ether'
            );
            if (splitType === 'custom') {
                const customSharesInput = document.getElementById('customShares')?.value;
                if (!customSharesInput) {
                    expenseMessage.textContent = 'Please enter custom shares for the expense.';
                    expenseMessage.classList.add('success');
                    return;
                }
                customShares = customSharesInput.split(',').map(s => parseInt(s.trim()));
                const sum = customShares.reduce((a, b) => a + b, 0);
                if (sum !== 100) {
                    expenseMessage.textContent = 'Custom shares must sum to 100%.';
                    expenseMessage.classList.add('success');
                    return;
                }
            }
            const account = await getAccount();
            if (!account) {
                expenseMessage.textContent = 'Error: No account connected. Please reconnect MetaMask.';
                expenseMessage.classList.add('success');
                return;
            }
            const tx = await contractInstance.methods.addExpense(groupId, description, amount, splitType, customShares).send({
                from: account,
                value: '0',
                gasPrice: web3.utils.toWei('50', 'gwei')
            });
            expenseMessage.innerHTML = `<strong>Expense added successfully!</strong> <a href="https://explorer-unstable.shardeum.org/tx/${tx.transactionHash}" target="_blank">View Tx</a>`;
            expenseMessage.classList.add('success');
            setTimeout(() => {
                e.target.reset();
                document.getElementById('groupCreation').style.display = 'none';
                toggleExpenseForm(true);
            }, 3000);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        expenseMessage.textContent = 'Error: ' + error.message;
        expenseMessage.classList.add('success');
    }
}

async function fetchSHMPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=shardeum&vs_currencies=usd,eur,inr');
        const data = await response.json();
        shmPrice = {
            usd: data.shardeum.usd || 1,
            eur: data.shardeum.eur || 1,
            inr: data.shardeum.inr || 1
        };
        console.log('SHM Price fetched:', shmPrice);
    } catch (error) {
        console.error('Error fetching SHM price:', error);
        shmPrice = { usd: 1, eur: 1, inr: 1 };
    }
}

async function updateSHMAmount() {
    const amountInput = document.getElementById('amount');
    const currency = document.getElementById('currency')?.value.toLowerCase();
    const shmAmountDisplay = document.getElementById('shmAmount');
    if (!amountInput || !shmAmountDisplay || !currency) return;

    const amount = parseFloat(amountInput.value);
    if (isNaN(amount)) {
        shmAmountDisplay.textContent = 'SHM Amount: Enter a valid amount';
        return;
    }
    if (!shmPrice) {
        await fetchSHMPrice();
    }
    const shmAmount = currency === 'shm' ? amount : amount / shmPrice[currency];
    shmAmountDisplay.textContent = `SHM Amount: ${shmAmount.toFixed(4)} SHM`;
}

function setupEventListeners() {
    const expenseForm = document.getElementById('expenseForm');
    const groupIdSelect = document.getElementById('groupId');
    const splitSelect = document.getElementById('split');
    const addMemberButton = document.getElementById('addMemberButton');
    const amountInput = document.getElementById('amount');
    const currencySelect = document.getElementById('currency');
    const metamaskButtons = document.querySelectorAll('.metamask-button');

    if (metamaskButtons) {
        metamaskButtons.forEach(btn => btn.addEventListener('click', handleMetaMaskToggle));
    }

    if (expenseForm) {
        expenseForm.addEventListener('submit', handleExpenseFormSubmit);
    }

    if (groupIdSelect) {
        groupIdSelect.addEventListener('change', toggleGroupCreation);
    }

    if (splitSelect) {
        splitSelect.addEventListener('change', () => {
            const customLabel = document.getElementById('customLabel');
            const customShares = document.getElementById('customShares');
            if (splitSelect.value === 'custom') {
                customLabel.style.display = 'block';
                customShares.style.display = 'block';
            } else {
                customLabel.style.display = 'none';
                customShares.style.display = 'none';
            }
        });
    }

    if (addMemberButton) {
        addMemberButton.addEventListener('click', () => {
            const memberInputs = document.getElementById('memberInputs');
            const newMemberInput = document.createElement('div');
            newMemberInput.className = 'member-input';
            newMemberInput.innerHTML = `
                <input type="text" class="member-name" placeholder="Member Name (e.g., Bob)">
                <input type="text" class="member-address" placeholder="e.g., 0x742d...">
                <button type="button" class="remove-member">Remove</button>
            `;
            memberInputs.appendChild(newMemberInput);
            newMemberInput.querySelector('.remove-member').addEventListener('click', () => {
                if (memberInputs.querySelectorAll('.member-input').length > 1) {
                    newMemberInput.remove();
                }
            });
        });
    }

    if (amountInput && currencySelect) {
        amountInput.addEventListener('input', updateSHMAmount);
        currencySelect.addEventListener('change', updateSHMAmount);
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-member')) {
            const memberInput = e.target.closest('.member-input');
            if (document.querySelectorAll('#memberInputs .member-input').length > 1) {
                memberInput.remove();
            }
        }
    });
}

async function populateDashboard() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    dashboardContent.innerHTML = 'Loading groups...';
    try {
        const account = await getAccount();
        if (!account) {
            dashboardContent.innerHTML = 'Please connect MetaMask to view your groups.';
            return;
        }

        const contractInstance = await getContract();
        if (!contractInstance) {
            dashboardContent.innerHTML = 'Error: Unable to connect to blockchain contract. Please check your MetaMask connection.';
            return;
        }

        const groupCount = parseInt(await contractInstance.methods.groupCount().call()) || 0;
        const groups = [];
        for (let i = 1; i <= groupCount; i++) {
            try {
                const group = await contractInstance.methods.getGroup(i).call();
                const members = group[1] || [];
                if (members.some(addr => addr.toLowerCase() === account.toLowerCase())) {
                    const isSettled = await isGroupSettled(i);
                    groups.push({ id: i, name: getGroupName(i), members, settled: isSettled });
                }
            } catch (error) {
                console.error(`Error fetching group ${i}:`, error);
            }
        }

        if (groups.length === 0) {
            dashboardContent.innerHTML = 'No groups found. Create one in the Add Expense page.';
            return;
        }

        const showSettled = localStorage.getItem('showSettled') === 'true';
        dashboardContent.innerHTML = `
            <button id="toggleSettledButton" class="toggle-settled-button">
                ${showSettled ? 'Hide Settled Groups' : 'Show Settled Groups'}
            </button>
            <div id="groups"></div>
        `;
        const toggleSettledButton = document.getElementById('toggleSettledButton');
        toggleSettledButton.addEventListener('click', () => {
            localStorage.setItem('showSettled', !showSettled);
            populateDashboard();
        });

        const groupsDiv = document.getElementById('groups');
        groupsDiv.innerHTML = '';

        for (const group of groups) {
            if (!showSettled && group.settled) continue;

            const expenses = [];
            const expenseIds = await contractInstance.methods.getGroupExpenseIds(group.id).call();
            for (const expenseId of expenseIds) {
                const expense = await contractInstance.methods.getExpense(expenseId).call();
                expenses.push({
                    id: expense[0],
                    description: expense[1],
                    amount: web3.utils.fromWei(expense[2], 'ether'),
                    payer: expense[3],
                    splitType: expense[4],
                    customShares: expense[5]
                });
            }

            const balanceData = await contractInstance.methods.getGroupBalances(group.id).call();
            const balMembers = balanceData[0] || [];
            const balances = balanceData[1] || [];

            const groupDiv = document.createElement('div');
            groupDiv.className = `group ${group.settled ? 'settled-group' : ''}`;
            const blockie = await createBlockie(group.id.toString(), 64, group.name[0]);
            groupDiv.innerHTML = `
                <div class="group-header">
                    <img src="${blockie}" class="group-avatar" alt="Group Avatar">
                    <h2>${group.name} (${group.id})
                        <button class="edit-group-name-button">✏️</button>
                    </h2>
                </div>
                <h3>Members</h3>
                <div class="members-container"></div>
                <h3>Expenses</h3>
                <div class="expenses-container"></div>
                <h3>Balances</h3>
                <div class="balances-container"></div>
                <h3>Settlement</h3>
                <div class="settlement-container"></div>
                <div class="history-toggle">Toggle Settlement History</div>
                <div class="history-log"></div>
                <h3>Contribution Breakdown</h3>
                <table class="contribution-table">
                    <tr>
                        <th>Member</th>
                        <th>Total Paid (SHM)</th>
                        <th>Fair Share (SHM)</th>
                        <th>Net Balance (SHM)</th>
                    </tr>
                </table>
            `;

            const membersContainer = groupDiv.querySelector('.members-container');
            for (const member of group.members) {
                const blockie = await createBlockie(member, 32, getMemberName(member)[0]);
                const memberDiv = document.createElement('div');
                memberDiv.className = 'member-item';
                memberDiv.innerHTML = `
                    <img src="${blockie}" class="member-avatar" alt="Member Avatar">
                    <span class="member-name">${getMemberName(member)}</span>
                    <button class="edit-name-button">✏️</button>
                `;
                memberDiv.querySelector('.edit-name-button').addEventListener('click', () => updateMemberName(member));
                membersContainer.appendChild(memberDiv);
            }

            const expensesContainer = groupDiv.querySelector('.expenses-container');
            for (const expense of expenses) {
                const blockie = await createBlockie(expense.payer, 32, getMemberName(expense.payer)[0]);
                const expenseDiv = document.createElement('div');
                expenseDiv.className = 'expense-item';
                expenseDiv.innerHTML = `
                    <img src="${blockie}" class="expense-avatar" alt="Payer Avatar">
                    <span>${expense.description}: ${parseFloat(expense.amount).toFixed(2)} SHM (Paid by ${getMemberName(expense.payer)}, ${expense.splitType} split)</span>
                `;
                expensesContainer.appendChild(expenseDiv);
            }

            const balancesContainer = groupDiv.querySelector('.balances-container');
            for (let i = 0; i < balMembers.length; i++) {
                const balance = parseFloat(web3.utils.fromWei(balances[i], 'ether')).toFixed(2);
                const blockie = await createBlockie(balMembers[i], 32, getMemberName(balMembers[i])[0]);
                const balanceDiv = document.createElement('div');
                balanceDiv.className = `balance-item ${balance > 0 ? 'positive' : balance < 0 ? 'negative' : 'settled'}`;
                balanceDiv.innerHTML = `
                    <img src="${blockie}" class="balance-avatar" alt="Member Avatar">
                    <span>${getMemberName(balMembers[i])}: ${balance} SHM</span>
                `;
                balancesContainer.appendChild(balanceDiv);
            }

            const settlementContainer = groupDiv.querySelector('.settlement-container');
            for (const member of group.members) {
                if (member.toLowerCase() === account.toLowerCase()) continue;
                const debtAmount = await getDebtAmount(group.id, member);
                if (parseFloat(debtAmount) <= 0) continue;
                const blockie = await createBlockie(member, 32, getMemberName(member)[0]);
                const settlementDiv = document.createElement('div');
                settlementDiv.className = `settlement-line ${debtAmount > 0 ? 'positive' : 'settled'}`;
                settlementDiv.innerHTML = `
                    <img src="${blockie}" class="balance-avatar" alt="Member Avatar">
                    <span>You owe ${getMemberName(member)} ${debtAmount} SHM</span>
                    <button class="mark-paid-button" ${group.settled ? 'disabled' : ''}>Mark as Paid</button>
                `;
                settlementContainer.appendChild(settlementDiv);
                if (!group.settled) {
                    settlementDiv.querySelector('.mark-paid-button').addEventListener('click', async () => {
                        try {
                            const contractInstance = await getContract();
                            if (!contractInstance) {
                                alert('Error: Unable to connect to blockchain contract. Please check your MetaMask connection.');
                                return;
                            }
                            const amountWei = web3.utils.toWei(debtAmount, 'ether');
                            const tx = await contractInstance.methods.settleDebt(group.id, member, amountWei).send({
                                from: account,
                                value: '0',
                                gasPrice: web3.utils.toWei('50', 'gwei')
                            });
                            console.log(`Debt settled: ${account} paid ${member} ${debtAmount} SHM in group ${group.id}`);
                            populateDashboard();
                        } catch (error) {
                            console.error('Error settling debt:', error);
                            alert('Error settling debt: ' + error.message);
                        }
                    });
                }
            }

            const historyToggle = groupDiv.querySelector('.history-toggle');
            const historyLog = groupDiv.querySelector('.history-log');
            historyToggle.addEventListener('click', async () => {
                if (historyLog.classList.contains('active')) {
                    historyLog.classList.remove('active');
                    historyLog.innerHTML = '';
                    return;
                }
                const settlements = await fetchSettlementHistory(group.id);
                historyLog.innerHTML = settlements.length === 0
                    ? '<p>No settlement history available.</p>'
                    : settlements.map(s => `
                        <div class="history-item">
                            ${getMemberName(s.from)} paid ${getMemberName(s.to)} ${s.amount} SHM on ${s.timestamp}
                            <a href="https://explorer-unstable.shardeum.org/tx/${s.txHash}" target="_blank">View Tx</a>
                        </div>
                    `).join('');
                historyLog.classList.add('active');
            });

            const contributionTable = groupDiv.querySelector('.contribution-table');
            const breakdown = await calculateContributionBreakdown(group.id, group.members, expenses);
            for (const entry of breakdown) {
                const row = document.createElement('tr');
                const netBalance = parseFloat(entry.netBalance).toFixed(2);
                row.innerHTML = `
                    <td>${entry.name}</td>
                    <td>${parseFloat(entry.totalPaid).toFixed(2)}</td>
                    <td>${parseFloat(entry.fairShare).toFixed(2)}</td>
                    <td class="${netBalance > 0 ? 'positive' : netBalance < 0 ? 'negative' : 'settled'}">${netBalance}</td>
                `;
                contributionTable.appendChild(row);
            }

            groupDiv.querySelector('.edit-group-name-button').addEventListener('click', () => updateGroupName(group.id));
            groupsDiv.appendChild(groupDiv);
        }
    } catch (error) {
        console.error('Error populating dashboard:', error);
        dashboardContent.innerHTML = 'Error loading groups: ' + error.message;
    }
}

async function calculateContributionBreakdown(groupId, members, expenses) {
    try {
        const contractInstance = await getContract();
        if (!contractInstance) {
            console.error('Contract not initialized in calculateContributionBreakdown');
            return [];
        }
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

        const balanceData = await contractInstance.methods.getGroupBalances(groupId).call();
        const balMembers = balanceData[0] || [];
        const balances = balanceData[1] || [];
        breakdown.forEach(b => {
            const balIndex = balMembers.findIndex(addr => addr.toLowerCase() === b.address.toLowerCase());
            if (balIndex !== -1) {
                b.netBalance = parseFloat(web3.utils.fromWei(balances[balIndex], 'ether'));
            }
        });

        return breakdown;
    } catch (error) {
        console.error(`Error calculating contribution breakdown for group ${groupId}:`, error);
        return [];
    }
}

async function getDebtAmount(groupId, toAddress) {
    try {
        const contractInstance = await getContract();
        if (!contractInstance) {
            console.error('Contract not initialized in getDebtAmount');
            return '0';
        }
        const userAddress = await getAccount();
        const balanceData = await contractInstance.methods.getGroupBalances(groupId).call();
        const balMembers = balanceData[0] || [];
        const balances = balanceData[1] || [];
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

document.addEventListener('DOMContentLoaded', async () => {
    await checkMetaMaskConnection();
    setupEventListeners();
});