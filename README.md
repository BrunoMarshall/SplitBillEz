# SplitBillEz
Decentralized Bill-Splitting on Shardeum PayFi

## Abstract
SplitBillEz is a decentralized bill-splitting application built on the [Shardeum](https://shardeum.org/) blockchain, leveraging PayFi for secure, low-cost, and instant peer-to-peer payment settlements. Inspired by Splitwise, it simplifies group expense tracking and automates settlements using SHM, EURO*, and USD* tokens, ensuring transparency, affordability, and accessibility for global users.

*Stable tokens/coins on Shardeum Blockchain

## Problem Statement
Traditional bill-splitting apps like Splitwise rely on centralized systems (e.g., bank transfers, PayPal) for settlements, leading to:
- **High transaction fees**: Payments via third-party gateways incur significant costs.
- **Lack of transparency**: Transaction records are not publicly verifiable.
- **Inaccessibility**: Unbanked populations and cross-border groups face barriers.
- **Data breach risks**: Dependency on intermediaries increases security vulnerabilities.
- **Slow and expensive**: Current solutions exclude millions from seamless financial participation.

### Transaction Fees (2025 Estimates)
- **PayPal**: 2.9% + $0.30 per transaction (standard domestic rate).
- **Venmo**: 3% for credit card transactions.
- **Splitwise**: No direct fees, but relies on third-party processors (e.g., PayPal/Venmo) with 2-3% fees.
- **Shardeum**: Gas fees < $0.01 per transaction due to autoscaling sharding.

### Unbanked Population
- **World Bank Global Findex (2024 estimates)**: ~1.4 billion adults unbanked globally, with 50% in Sub-Saharan Africa, 20% in South Asia, and significant populations elsewhere.

## Proposed Solution
**SplitBillEz**: A decentralized “Split Bill Easy” application on Shardeum’s autoscaling blockchain.

### Key Features
- Track group expenses and debts transparently on-chain.
- Automate settlements with ultra-low fees (< $0.01).
- Smart contracts for trustless, instant peer-to-peer payments.
- User-friendly UI for creating groups, adding expenses, and settling balances.
- Accessible globally, no bank account required.
- **Visuals**: Flowchart of expense tracking → smart contract settlement → SHM payment (to be added).

### Why Shardeum PayFi?
- **Dynamic state sharding**: Ensures scalability and low gas fees forever.
- **PayFi focus**: Enables fast, affordable, borderless payments.
- **EVM compatibility**: Simplifies smart contract development.
- **Community-driven validator model**: Ensures decentralization.

## How It Works
1. Users connect their MetaMask wallets to SplitBillEz.
2. Create groups, add expenses, and assign splits (e.g., equal or custom percentages).
3. Smart contracts record debts on Shardeum’s blockchain.
4. Settle balances instantly using SHM, EURO*, or USD* tokens.
5. View transaction history transparently on the Shardeum blockchain explorer.

## Live Demo
Visit the live site: [https://www.splitbillez.com/](https://www.splitbillez.com/)

## Installation
To run SplitBillEz locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/BrunoMarshall/SplitBillEz.git
   cd SplitBillEz
