// app.js - Shared Web3 Integration for SplitBillEz
const CONTRACT_ADDRESS = '0x7f8f279841899b6abf34956658403bd597688d59';
const CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"groupId","type":"uint256"},{"indexed":false,"internalType":"address","name":"debtor","type":"address"},{"indexed":false,"internalType":"address","name":"creditor","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"DebtRecorded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"groupId","type":"uint256"},{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"DebtSettled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"expenseId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"groupId","type":"uint256"},{"indexed":false,"internalType":"string","name":"description","type":"string"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"address","name":"payer","type":"address"},{"indexed":false,"internalType":"string","name":"splitType","type":"string"},{"indexed":false,"internalType":"uint256[]","name":"customShares","type":"uint256[]"}],"name":"ExpenseAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"groupId","type":"uint256"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"address[]","name":"members","type":"address[]"}],"name":"GroupCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"groupId","type":"uint256"}],"name":"GroupSettled","type":"event"},{"inputs":[{"internalType":"uint256","name":"_groupId","type":"uint256"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"string","name":"_splitType","type":"string"},{"internalType":"uint256[]","name":"_customShares","type":"uint256[]"}],"name":"addExpense","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"balances","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"address[]","name":"_members","type":"address[]"}],"name":"createGroup","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"expenseCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"expenses","outputs":[{"internalType":"uint256","name":"groupId","type":"uint256"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"payer","type":"address"},{"internalType":"string","name":"splitType","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_expenseId","type":"uint256"}],"name":"getExpense","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_groupId","type":"uint256"}],"name":"getGroup","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_groupId","type":"uint256"}],"name":"getGroupBalances","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"int256[]","name":"","type":"int256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_groupId","type":"uint256"}],"name":"getGroupExpenseIds","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_groupId","type":"uint256"}],"name":"getGroupSettledStatus","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"groupCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"groupExpenseIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"groups","outputs":[{"internalType":"string","name":"name","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"isGroupSettled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ownerWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_groupId","type":"uint256"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"settleDebt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userGroups","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

let web3, userAccount, contract, shmPrice = null;
const RPC_URLS = ['https://api-mezame.shardeum.org/'];

async function initWeb3(rpcIndex = 0) {
    if (!window.ethereum) {
        alert('MetaMask not installed. Please install MetaMask.');
        return false;
    }
    try {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x1fb7' }] }).catch(async (e) => {
            if (e.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{ chainId: '0x1fb7', chainName: 'Shardeum EVM Testnet', rpcUrls: [RPC_URLS[rpcIndex]], nativeCurrency: { name: 'SHM', symbol: 'SHM', decimals: 18 }, blockExplorerUrls: ['https://explorer-mezame.shardeum.org/'] }]
                });
            }
        });
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        await updateUI();
        return true;
    } catch (error) {
        if (rpcIndex < RPC_URLS.length - 1) return await initWeb3(rpcIndex + 1);
        alert('Failed to connect: ' + error.message);
        return false;
    }
}

async function disconnectWallet() {
    userAccount = null;
    contract = null;
    web3 = null;
    await updateUI();
}

async function handleMetaMaskToggle() {
    if (userAccount) {
        await disconnectWallet();
    } else {
        await initWeb3();
        
        const acc = await getAccount();
        if (acc) {
            const userAddressFields = document.querySelectorAll('.user-address, #userAddress');
            userAddressFields.forEach(field => {
                field.value = acc;
                field.placeholder = acc;
            });
        }
        
        if (document.getElementById('groupId')) {
            await populateGroupDropdown();
        } else if (document.getElementById('dashboardContent')) {
            await populateDashboard();
        } else if (document.getElementById('groupsContent')) {
            await populateGroupsList();
        }
    }
}

async function updateUI() {
    document.querySelectorAll('.metamask-button').forEach(btn => {
        btn.textContent = userAccount ? `Disconnect (${userAccount.slice(0,6)}...${userAccount.slice(-4)})` : 'Connect with MetaMask';
        btn.style.backgroundColor = userAccount ? '#28a745' : '#ffffff';
    });
}

function truncateAddress(addr) {
    return addr && addr.length >= 10 ? `${addr.slice(0,6)}...${addr.slice(-4)}` : 'Unknown';
}

function getMemberName(addr) {
    const names = JSON.parse(localStorage.getItem('memberNames') || '{}');
    return names[addr?.toLowerCase()] || truncateAddress(addr);
}

function updateMemberName(addr) {
    const name = prompt(`Enter new name:`, getMemberName(addr));
    if (name && name.trim()) {
        const names = JSON.parse(localStorage.getItem('memberNames') || '{}');
        names[addr.toLowerCase()] = name.trim();
        localStorage.setItem('memberNames', JSON.stringify(names));
        populateDashboard();
    }
}

async function loadBlockiesScript() {
    if (typeof makeBlockie === 'function') return true;
    return new Promise(r => {
        const s = document.createElement('script');
        s.src = 'js/ethereum-blockies-base64.min.js';
        s.onload = () => r(true);
        s.onerror = () => r(false);
        document.head.appendChild(s);
    });
}

async function createBlockie(addr, size = 32, initial = '') {
    try {
        await loadBlockiesScript();
        if (typeof makeBlockie === 'function') return await makeBlockie(addr || '0x0', { size: 8, scale: size / 8 });
    } catch (e) {}
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ccc';
    ctx.fillRect(0, 0, size, size);
    if (initial) {
        ctx.fillStyle = 'white';
        ctx.font = `${size/2}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initial, size/2, size/2);
    }
    return c.toDataURL();
}

async function checkMetaMaskConnection() {
    if (!window.ethereum) return;
    if (!web3) await initWeb3();
    const acc = await getAccount();
    if (acc) {
        const userAddressFields = document.querySelectorAll('.user-address, #userAddress');
        userAddressFields.forEach(field => {
            field.value = acc;
            field.placeholder = acc;
        });
        
        if (document.getElementById('groupId')) {
            await populateGroupDropdown();
        }
        if (document.getElementById('groupsContent')) {
            await populateGroupsList();
        }
        if (document.getElementById('dashboardContent')) {
            await populateDashboard();
        }
    }
}

async function getDebtAmount(gid, to) {
    try {
        const user = await getAccount();
        const bd = await contract.methods.getGroupBalances(gid).call();
        const mems = bd.members || bd[0] || [];
        const bals = bd.bals || bd[1] || [];
        const ui = mems.findIndex(a => a.toLowerCase() === user.toLowerCase());
        const ti = mems.findIndex(a => a.toLowerCase() === to.toLowerCase());
        if (ui === -1 || ti === -1) return '0';
        const ub = parseFloat(web3.utils.fromWei(bals[ui] || '0', 'ether'));
        const tb = parseFloat(web3.utils.fromWei(bals[ti] || '0', 'ether'));
        if (ub >= 0 || tb <= 0) return '0';
        return Math.min(Math.abs(ub), tb).toFixed(2);
    } catch {
        return '0';
    }
}

async function populateDashboard() {
    const dc = document.getElementById('dashboardContent');
    if (!dc) return;
    dc.innerHTML = '<p>Loading...</p>';
    if (!web3 || !contract || !userAccount) {
        dc.innerHTML = '<p>Connect MetaMask.</p>';
        return;
    }
    try {
        const user = await getAccount();
        const gc = parseInt(await contract.methods.groupCount().call()) || 0;
        const gids = new Set();
        
        for (let i = 0; i < Math.min(gc, 50); i++) {
            try {
                const gid = await contract.methods.userGroups(user, i).call();
                if (gid && parseInt(gid) > 0) gids.add(gid.toString());
            } catch (e) {
                if (e.message.includes('reverted')) break;
            }
        }
        
        for (let i = 1; i <= gc; i++) {
            try {
                const r = await contract.methods.getGroup(i).call();
                const ms = r.members || r[1] || [];
                if (ms.map(a => a.toLowerCase()).includes(user.toLowerCase())) gids.add(i.toString());
            } catch {}
        }
        
        if (gids.size === 0) {
            dc.innerHTML = '<p>No groups. Create one in <a href="groups.html">Groups</a>.</p>';
            return;
        }
        
        dc.innerHTML = '<div class="dashboard-summary"></div><div class="dashboard-groups"></div>';
        const summaryDiv = dc.querySelector('.dashboard-summary');
        const groupsDiv = dc.querySelector('.dashboard-groups');
        
        let totalOwed = 0;
        let totalOwing = 0;
        let activeGroupCount = 0;
        
        for (let gid of gids) {
            try {
                const isSettled = await contract.methods.getGroupSettledStatus(gid).call();
                if (isSettled) continue;
                
                activeGroupCount++;
                const r = await contract.methods.getGroup(gid).call();
                const name = r.name || r[0] || 'Unnamed';
                const mems = r.members || r[1] || [];
                const gb = await createBlockie(gid.toString(), 64);
                const mas = await Promise.all(mems.map(async a => ({
                    addr: a,
                    name: getMemberName(a),
                    avatar: await createBlockie(a, 32, getMemberName(a)[0])
                })));
                
                const bd = await contract.methods.getGroupBalances(gid).call();
                const bms = bd.members || bd[0] || [];
                const bls = bd.bals || bd[1] || [];
                const eids = await contract.methods.getGroupExpenseIds(gid).call();
                const exps = (await Promise.all(eids.map(async eid => {
                    try {
                        const e = await contract.methods.getExpense(eid).call();
                        return {
                            id: eid,
                            description: e[1] || e.description || 'N/A',
                            amount: web3.utils.fromWei(e[2] || e.amount || '0', 'ether'),
                            payer: e[3] || e.payer || 'Unknown',
                            splitType: e[4] || e.splitType || 'Unknown',
                            customShares: e[5] || e.customShares || []
                        };
                    } catch (err) {
                        console.error('Error fetching expense:', eid, err);
                        return null;
                    }
                }))).filter(e => e);
                
                const cb = mems.map(m => ({
                    address: m,
                    name: getMemberName(m),
                    totalPaid: 0,
                    fairShare: 0,
                    netBalance: 0
                }));
                
                for (const ex of exps) {
                    const amt = parseFloat(ex.amount);
                    const pi = cb.findIndex(b => b.address.toLowerCase() === ex.payer.toLowerCase());
                    if (pi !== -1) cb[pi].totalPaid += amt;
                    const shs = ex.splitType === 'custom' && ex.customShares ? ex.customShares.map(s => parseInt(s) / 100) : mems.map(() => 1 / mems.length);
                    mems.forEach((m, i) => {
                        const mi = cb.findIndex(b => b.address.toLowerCase() === m.toLowerCase());
                        if (mi !== -1) cb[mi].fairShare += amt * shs[i];
                    });
                }
                
                cb.forEach(b => {
                    const bi = bms.findIndex(a => a.toLowerCase() === b.address.toLowerCase());
                    if (bi !== -1) b.netBalance = parseFloat(web3.utils.fromWei(bls[bi].toString(), 'ether'));
                    b.totalPaid = parseFloat(b.totalPaid.toFixed(2));
                    b.fairShare = parseFloat(b.fairShare.toFixed(2));
                    b.netBalance = parseFloat(b.netBalance.toFixed(2));
                });
                
                const userBalance = cb.find(b => b.address.toLowerCase() === user.toLowerCase());
                if (userBalance) {
                    if (userBalance.netBalance > 0) totalOwed += userBalance.netBalance;
                    if (userBalance.netBalance < 0) totalOwing += Math.abs(userBalance.netBalance);
                }
                
                const sls = [];
                for (let i = 0; i < mems.length; i++) {
                    const bal = parseFloat(web3.utils.fromWei(bls[i].toString(), 'ether'));
                    if (bal >= 0) continue;
                    for (let j = 0; j < mems.length; j++) {
                        if (i === j) continue;
                        const tb = parseFloat(web3.utils.fromWei(bls[j].toString(), 'ether'));
                        if (tb <= 0) continue;
                        const d = Math.min(Math.abs(bal), tb);
                        if (d > 0.01) sls.push({
                            from: mems[i],
                            to: mems[j],
                            amount: d.toFixed(2),
                            fromName: getMemberName(mems[i]),
                            toName: getMemberName(mems[j])
                        });
                    }
                }
                
                const gd = document.createElement('div');
                gd.className = 'group group-card';
                gd.innerHTML = `
                    <div class="group-header">
                        <img src="${gb}" class="group-avatar">
                        <div class="group-title">
                            <h3>${name}</h3>
                            <span class="group-id">ID: ${gid}</span>
                        </div>
                    </div>
                    
                    <div class="group-stats">
                        <div class="stat-item">
                            <span class="stat-label">Members</span>
                            <span class="stat-value">${mems.length}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Expenses</span>
                            <span class="stat-value">${exps.length}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Your Balance</span>
                            <span class="stat-value ${userBalance.netBalance > 0 ? 'positive' : userBalance.netBalance < 0 ? 'negative' : 'settled'}">${userBalance.netBalance.toFixed(2)} SHM</span>
                        </div>
                    </div>
                    
                    <details class="group-details">
                        <summary>View Details</summary>
                        <div class="group-content">
                            <h4>Members</h4>
                            <div class="members-container">
                                ${mas.map(({ name, avatar, addr }) => `
                                    <span class="member-item">
                                        <img src="${avatar}" class="member-avatar">
                                        <span class="member-name">${name}</span>
                                        <button class="edit-name-button" data-address="${addr}">✏️</button>
                                    </span>
                                `).join('')}
                            </div>
                            
                            <h4>Recent Expenses</h4>
                            <div class="expenses-list">
                                ${exps.slice(-5).reverse().map(e => `<div class="expense-item-compact">${e.description} - ${e.amount} SHM (${getMemberName(e.payer)})</div>`).join('') || '<p>No expenses.</p>'}
                            </div>
                            
                            <h4>Settlement Status</h4>
                            <div class="settlement-container">
                                ${sls.map(l => `
                                    <div class="settlement-line ${l.from.toLowerCase() === user.toLowerCase() ? 'negative' : 'positive'}">
                                        ${l.fromName} → ${l.toName}: ${l.amount} SHM
                                    </div>
                                `).join('') || '<p class="all-settled">✓ All settled</p>'}
                            </div>
                            
                            <h4>Quick Settle</h4>
                            <form id="sf-${gid}" class="quick-settle-form">
                                <select id="st-${gid}" required>
                                    <option value="">Select member</option>
                                    ${mems.filter(a => a.toLowerCase() !== user.toLowerCase()).map(a => `<option value="${a}">${getMemberName(a)}</option>`).join('')}
                                </select>
                                <input type="number" id="sa-${gid}" placeholder="Amount" step="0.01" required>
                                <button type="submit" class="submit-group">Settle</button>
                            </form>
                            <p id="sm-${gid}" class="settle-message"></p>
                        </div>
                    </details>
                `;
                groupsDiv.appendChild(gd);
                
                document.getElementById(`st-${gid}`).addEventListener('change', async () => {
                    const t = document.getElementById(`st-${gid}`).value;
                    if (t) {
                        const d = await getDebtAmount(gid, t);
                        document.getElementById(`sa-${gid}`).value = d !== '0' ? d : '';
                    }
                });
                
                document.getElementById(`sf-${gid}`).addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const t = document.getElementById(`st-${gid}`).value;
                    const a = web3.utils.toWei(document.getElementById(`sa-${gid}`).value, 'ether');
                    const m = document.getElementById(`sm-${gid}`);
                    try {
                        const tx = await contract.methods.settleDebt(gid, t, a).send({
                            from: await getAccount(),
                            value: '0',
                            maxPriorityFeePerGas: web3.utils.toWei('2500000', 'gwei'),
                            maxFeePerGas: web3.utils.toWei('2500000', 'gwei'),
                            gas: 800000
                        });
                        m.textContent = 'Settled! TX: ' + tx.transactionHash;
                        m.className = 'settle-message success';
                        await populateDashboard();
                    } catch (err) {
                        m.textContent = 'Error: ' + err.message;
                        m.className = 'settle-message error';
                    }
                });
                
                gd.querySelectorAll('.edit-name-button').forEach(b => b.addEventListener('click', () => updateMemberName(b.dataset.address)));
            } catch (e) {
                console.error('Group error:', e);
            }
        }
        
        if (activeGroupCount === 0) {
            dc.innerHTML = '<p>All groups are settled. View settled groups in <a href="groups.html">Groups</a>.</p>';
            return;
        }
        
        summaryDiv.innerHTML = `
            <div class="summary-card">
                <h3>Your Summary</h3>
                <div class="summary-stats">
                    <div class="summary-stat positive">
                        <div class="summary-stat-value">+${totalOwed.toFixed(2)} SHM</div>
                        <div class="summary-stat-label">You are owed</div>
                    </div>
                    <div class="summary-stat negative">
                        <div class="summary-stat-value">-${totalOwing.toFixed(2)} SHM</div>
                        <div class="summary-stat-label">You owe</div>
                    </div>
                    <div class="summary-stat">
                        <div class="summary-stat-value">${activeGroupCount}</div>
                        <div class="summary-stat-label">Active Groups</div>
                    </div>
                </div>
            </div>
        `;
    } catch (e) {
        dc.innerHTML = '<p>Error loading dashboard.</p>';
    }
}

async function fetchShmPrice() {
    shmPrice = {};
    for (const c of ['usd', 'eur', 'inr', 'shm']) {
        try {
            if (c === 'shm') {
                shmPrice[c] = 1;
            } else {
                const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=shardeum&vs_currencies=${c}`);
                const d = await r.json();
                shmPrice[c] = d.shardeum?.[c] || (c === 'usd' ? 0.11 : c === 'eur' ? 0.1 : 9.0);
            }
        } catch {
            shmPrice[c] = c === 'shm' ? 1 : (c === 'usd' ? 0.11 : c === 'eur' ? 0.1 : 9.0);
        }
    }
    updateShmAmount();
}

function updateShmAmount() {
    const ai = document.getElementById('amount'), cs = document.getElementById('currency'), sa = document.getElementById('shmAmount');
    if (!sa || !ai || !cs || !shmPrice) return;
    const a = parseFloat(ai.value);
    if (isNaN(a) || a <= 0) {
        sa.textContent = 'SHM Amount: Enter amount';
        return;
    }
    const c = cs.value.toLowerCase();
    sa.textContent = `SHM Amount: ${(c === 'shm' ? a : a / shmPrice[c]).toFixed(4)} SHM`;
}

async function populateGroupsList() {
    const gc = document.getElementById('groupsContent');
    if (!gc) return;
    gc.innerHTML = '<p>Loading...</p>';
    if (!web3 || !contract || !userAccount) {
        gc.innerHTML = '<p>Connect MetaMask to view groups.</p>';
        return;
    }
    try {
        const user = await getAccount();
        const groupCount = parseInt(await contract.methods.groupCount().call()) || 0;
        const gids = new Set();
        
        for (let i = 0; i < Math.min(groupCount, 50); i++) {
            try {
                const gid = await contract.methods.userGroups(user, i).call();
                if (gid && parseInt(gid) > 0) gids.add(gid.toString());
            } catch (e) {
                if (e.message.includes('reverted')) break;
            }
        }
        
        for (let i = 1; i <= groupCount; i++) {
            try {
                const r = await contract.methods.getGroup(i).call();
                const ms = r.members || r[1] || [];
                if (ms.map(a => a.toLowerCase()).includes(user.toLowerCase())) gids.add(i.toString());
            } catch {}
        }
        
        if (gids.size === 0) {
            gc.innerHTML = '<p>No groups yet. Create one above!</p>';
            return;
        }
        
        gc.innerHTML = '<div class="groups-active"></div><div class="groups-settled"></div>';
        const activeDiv = gc.querySelector('.groups-active');
        const settledDiv = gc.querySelector('.groups-settled');
        
        activeDiv.innerHTML = '<h4>Active Groups</h4>';
        settledDiv.innerHTML = '<h4>Settled Groups (History)</h4>';
        
        let hasActive = false;
        let hasSettled = false;
        
        for (let gid of gids) {
            try {
                const isSettled = await contract.methods.getGroupSettledStatus(gid).call();
                const r = await contract.methods.getGroup(gid).call();
                const name = r.name || r[0] || 'Unnamed';
                const mems = r.members || r[1] || [];
                const gb = await createBlockie(gid.toString(), 48);
                
                const groupDiv = document.createElement('div');
                groupDiv.className = isSettled ? 'group group-settled' : 'group';
	if (isSettled) {
                    const eids = await contract.methods.getGroupExpenseIds(gid).call();
                    const expenses = await Promise.all(eids.map(async eid => {
                        try {
                            const e = await contract.methods.getExpense(eid).call();
                            return {
                                description: e[1] || e.description || 'N/A',
                                amount: web3.utils.fromWei(e[2] || e.amount || '0', 'ether'),
                                payer: e[3] || e.payer || 'Unknown'
                            };
                        } catch (err) {
                            console.error('Error fetching expense:', eid, err);
                            return null;
                        }
                    }));
                    
                    groupDiv.innerHTML = `
                        <div class="group-list-item">
                            <img src="${gb}" class="group-avatar-small">
                            <div class="group-info">
                                <h4>${name} <span class="settled-badge">✓ Settled</span></h4>
                                <p><strong>ID:</strong> ${gid} | <strong>Members:</strong> ${mems.length} | <strong>Expenses:</strong> ${expenses.filter(e => e).length}</p>
                                <details class="group-history-details">
                                    <summary>View Full History</summary>
                                    <div class="history-content">
                                        <h5>Members</h5>
                                        <ul class="members-list">
                                            ${mems.map(m => `<li>${getMemberName(m)} (${truncateAddress(m)})</li>`).join('')}
                                        </ul>
                                        <h5>Transaction History</h5>
                                        <div class="transaction-history">
                                            ${expenses.filter(e => e).map(e => `
                                                <div class="transaction-item">
                                                    <span class="transaction-desc">${e.description}</span>
                                                    <span class="transaction-amount">${e.amount} SHM</span>
                                                    <span class="transaction-payer">by ${getMemberName(e.payer)}</span>
                                                </div>
                                            `).join('') || '<p>No transaction history available</p>'}
                                        </div>
                                        <div class="settlement-info">
                                            <p class="settlement-status">✓ All debts have been settled</p>
                                            <a href="https://explorer-mezame.shardeum.org/address/${CONTRACT_ADDRESS}" target="_blank" class="explorer-link">
                                                View on Explorer →
                                            </a>
                                        </div>
                                    </div>
                                </details>
                            </div>
                        </div>
                    `;
                    settledDiv.appendChild(groupDiv);
                    hasSettled = true;
                } else {
                    groupDiv.innerHTML = `
                        <div class="group-list-item">
                            <img src="${gb}" class="group-avatar-small">
                            <div class="group-info">
                                <h4>${name}</h4>
                                <p><strong>ID:</strong> ${gid} | <strong>Members:</strong> ${mems.length}</p>
                                <details>
                                    <summary>Show Members</summary>
                                    <ul class="members-list">
                                        ${mems.map(m => `<li>${getMemberName(m)} (${truncateAddress(m)})</li>`).join('')}
                                    </ul>
                                </details>
                            </div>
                        </div>
                    `;
                    activeDiv.appendChild(groupDiv);
                    hasActive = true;
                }
            } catch (e) {
                console.error('Error loading group:', e);
            }
        }
        
        if (!hasActive) activeDiv.innerHTML += '<p>No active groups.</p>';
        if (!hasSettled) settledDiv.innerHTML += '<p>No settled groups yet.</p>';
        
    } catch (e) {
        gc.innerHTML = '<p>Error loading groups.</p>';
    }
}

async function populateGroupDropdown() {
    const gs = document.getElementById('groupId');
    if (!gs) return;
    gs.innerHTML = '<option value="">Loading...</option>';
    if (!web3 || !contract || !userAccount) {
        gs.innerHTML = '<option value="">Connect wallet</option>';
        return;
    }
    try {
        const user = await getAccount();
        const gc = parseInt(await contract.methods.groupCount().call()) || 0;
        const gids = new Set();
        
        for (let i = 0; i < Math.min(gc, 50); i++) {
            try {
                const g = await contract.methods.userGroups(user, i).call();
                if (g && parseInt(g) > 0) gids.add(g.toString());
            } catch (e) {
                if (e.message.includes('reverted')) break;
            }
        }
        
        for (let i = 1; i <= gc; i++) {
            try {
                const r = await contract.methods.getGroup(i).call();
                const ms = r.members || r[1] || [];
                if (ms.map(a => a.toLowerCase()).includes(user.toLowerCase())) gids.add(i.toString());
            } catch {}
        }
        
        gs.innerHTML = '<option value="">Select a group</option>';
        if (gids.size === 0) {
            gs.innerHTML += '<option value="" disabled>No groups - create one in Groups page</option>';
        } else {
            let hasActiveGroups = false;
            for (let g of gids) {
                try {
                    const isSettled = await contract.methods.getGroupSettledStatus(g).call();
                    if (isSettled) continue;
                    
                    hasActiveGroups = true;
                    const r = await contract.methods.getGroup(g).call();
                    const n = r.name || r[0] || 'Unnamed';
                    const o = document.createElement('option');
                    o.value = g;
                    o.textContent = `${n} (${g})`;
                    gs.appendChild(o);
                } catch {}
            }
            
            if (!hasActiveGroups) {
                gs.innerHTML = '<option value="" disabled>All groups are settled - create a new one</option>';
            }
        }
    } catch {
        gs.innerHTML = '<option value="">Error loading groups</option>';
    }
}

function toggleCustomShares() {
    const s = document.getElementById('split');
    const container = document.getElementById('customSharesContainer');
    if (s && container) {
        container.style.display = s.value === 'custom' ? 'block' : 'none';
    }
}

function addMemberField() {
    const mi = document.getElementById('memberInputs');
    if (!mi || mi.children.length >= 10) return;
    const memberNumber = mi.children.length + 1;
    const d = document.createElement('div');
    d.className = 'member-input';
    d.innerHTML = `<span class="member-label">Member ${memberNumber}:</span><input type="text" class="member-name" placeholder="Member Name" required><input type="text" class="member-address" placeholder="0x..." required><button type="button" class="remove-member">Remove</button>`;
    mi.appendChild(d);
    d.querySelector('.remove-member').addEventListener('click', () => {
        removeMember(d.querySelector('.remove-member'));
        updateMemberNumbers();
    });
}

function updateMemberNumbers() {
    const mi = document.getElementById('memberInputs');
    if (!mi) return;
    const memberInputs = mi.querySelectorAll('.member-input');
    memberInputs.forEach((input, index) => {
        const label = input.querySelector('.member-label');
        if (label) {
            if (index === 0) {
                label.textContent = 'Member 1 (You):';
            } else {
                label.textContent = `Member ${index + 1}:`;
            }
        }
    });
}

function removeMember(btn) {
    const mi = document.getElementById('memberInputs');
    if (mi && mi.children.length > 2) btn.parentElement.remove();
}

async function handleCreateGroupSubmit(e) {
    e.preventDefault();
    const gm = document.getElementById('groupMessage');
    if (!web3 || !contract || !userAccount) {
        gm.textContent = 'Connect MetaMask first.';
        return;
    }
    
    const gn = document.getElementById('groupName')?.value;
    const mis = document.getElementsByClassName('member-input');
    if (!gn) {
        gm.textContent = 'Enter group name.';
        return;
    }
    
    const mems = [], names = {};
    const user = (await getAccount()).toLowerCase();
    for (let mi of mis) {
        const a = mi.querySelector('.member-address')?.value?.trim().toLowerCase();
        const n = mi.querySelector('.member-name')?.value?.trim();
        if (a && web3.utils.isAddress(a)) {
            mems.push(a);
            if (n && n !== 'Me') names[a] = n;
        }
    }
    
    if (mems.length < 2) {
        gm.textContent = 'Need at least 2 members.';
        return;
    }
    if (!mems.includes(user)) {
        gm.textContent = 'Your address missing.';
        return;
    }
    
    const en = JSON.parse(localStorage.getItem('memberNames') || '{}');
    localStorage.setItem('memberNames', JSON.stringify(Object.assign({}, en, names)));
    
    try {
        const tx = await contract.methods.createGroup(gn, mems).send({
            from: await getAccount(),
            value: '0',
            maxPriorityFeePerGas: web3.utils.toWei('2500000', 'gwei'),
            maxFeePerGas: web3.utils.toWei('2500000', 'gwei'),
            gas: 800000
        });
        gm.innerHTML = `<strong>Group created!</strong> <a href="https://explorer-mezame.shardeum.org/tx/${tx.transactionHash}" target="_blank">View TX</a>`;
        gm.className = 'success-message';
        setTimeout(() => {
            e.target.reset();
            populateGroupsList();
        }, 2000);
    } catch (err) {
        gm.textContent = 'Error: ' + err.message;
        gm.className = 'error-message';
    }
}

async function handleExpenseFormSubmit(e) {
    e.preventDefault();
    const em = document.getElementById('expenseMessage');
    if (!web3 || !contract || !userAccount) {
        em.textContent = 'Connect MetaMask first.';
        return;
    }
    
    const gid = document.getElementById('groupId')?.value;
    if (!gid) {
        em.textContent = 'Please select a group.';
        return;
    }
    
    const desc = document.getElementById('description')?.value;
    const ai = document.getElementById('amount')?.value;
    const curr = document.getElementById('currency')?.value;
    let amt;
    
    try {
        const sa = curr.toLowerCase() === 'shm' ? parseFloat(ai) : parseFloat(ai) / shmPrice[curr.toLowerCase()];
        amt = web3.utils.toWei(sa.toFixed(18), 'ether');
    } catch {
        em.textContent = 'Invalid amount.';
        return;
    }
    
    const st = document.getElementById('split')?.value;
    let cs = [];
    if (st === 'custom') {
        try {
            cs = document.getElementById('customShares')?.value.split(',').map(s => parseInt(s.trim()));
            if (cs.reduce((s, v) => s + v, 0) !== 100) {
                em.textContent = 'Shares must sum to 100%.';
                return;
            }
            const result = await contract.methods.getGroup(gid).call();
            const ms = result.members || result[1] || [];
            if (cs.length !== ms.length) {
                em.textContent = 'Shares count mismatch.';
                return;
            }
        } catch {
            em.textContent = 'Invalid shares format.';
            return;
        }
    }
    
    try {
        const tx = await contract.methods.addExpense(gid, desc, amt, st, cs).send({
            from: await getAccount(),
            value: '0',
            maxPriorityFeePerGas: web3.utils.toWei('2500000', 'gwei'),
            maxFeePerGas: web3.utils.toWei('2500000', 'gwei'),
            gas: 800000
        });
        em.innerHTML = `<strong>Expense added!</strong> <a href="https://explorer-mezame.shardeum.org/tx/${tx.transactionHash}" target="_blank">View TX</a>`;
        setTimeout(() => {
            e.target.reset();
            window.location.href = 'dashboard.html';
        }, 2000);
    } catch (err) {
        em.textContent = 'Error: ' + err.message;
    }
}

function getContract() {
    return contract;
}

async function getAccount() {
    if (!web3 || !window.ethereum) return null;
    try {
        const accs = await window.ethereum.request({ method: 'eth_accounts' });
        return accs[0] || null;
    } catch {
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    document.querySelector('.metamask-button')?.addEventListener('click', handleMetaMaskToggle);
    
    const ef = document.getElementById('expenseForm');
    if (ef) {
        ef.addEventListener('submit', handleExpenseFormSubmit);
        document.getElementById('split')?.addEventListener('change', toggleCustomShares);
        document.getElementById('amount')?.addEventListener('input', updateShmAmount);
        document.getElementById('currency')?.addEventListener('change', updateShmAmount);
        await fetchShmPrice();
    }
    
    const cgf = document.getElementById('createGroupForm');
    if (cgf) {
        cgf.addEventListener('submit', handleCreateGroupSubmit);
        document.getElementById('addMemberButton')?.addEventListener('click', addMemberField);
    }
    
    await checkMetaMaskConnection();
});