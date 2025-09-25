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
        console.log('Web3 initialized:', web3);
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
        userAccount = accounts[0];
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        console.log('Connected:', userAccount);
        await updateUI();
        return true;
    } catch (error) {
        console.error('Error initializing Web3:', error);
        alert('Failed to connect to MetaMask: ' + error.message);
        return false;
    }
}

async function updateUI() {
    const buttons = document.querySelectorAll('.metamask-button');
    buttons.forEach(btn => {
        if (userAccount) {
            btn.textContent = `Connected: ${userAccount.slice(0,6)}...${userAccount.slice(-4)}`;
            btn.style.backgroundColor = '#28a745';
            btn.disabled = true;
        } else {
            btn.textContent = 'Connect with MetaMask';
            btn.style.backgroundColor = '#ffffff';
            btn.disabled = false;
        }
    });
}

// Export globals
window.initWeb3 = initWeb3;
window.getContract = () => contract;
window.getAccount = () => userAccount;
window.web3 = () => web3; // Changed to function to avoid undefined issues