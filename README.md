# AlgoBharatDevTrackCompetition24

# Decentralized Escrow Service

This project provides a decentralized escrow service implemented using TEALScript, a TypeScript library for building Algorand smart contracts. The contract enables secure transactions between two parties by locking funds until specific conditions are met. It ensures transparency and accountability while facilitating efficient fund transfers in Web3 applications.

---

## Features

- **Escrow Creation**: Initialize the escrow with the payment amount, worker (receiver), and admin addresses.
- **Add Funds to Escrow**: Deposit the agreed payment amount to the escrow account.
- **Set Condition Met**: Admin or the creator can confirm the conditions for releasing the funds.
- **Release Funds**: Automatically transfer funds to the worker when the conditions are met.
- **Cancel Escrow**: The creator can cancel the escrow and reclaim any remaining funds.
- **Secure Transactions**: Ensures that all actions are authorized and verifiable.

---

## Smart Contract Overview

### State Variables

- **paymentAmount**: The agreed cost of the asset or service.
- **worker**: The address of the worker (asset receiver).
- **conditionMet**: Boolean indicating whether the release condition is met.
- **admin**: Admin address for additional control.

### Methods

1. **createApplication(worker: Address, adminAddress: Address)**
   - Initializes the escrow contract.

2. **addFundsToEscrow(ebaTxn: PayTxn)**
   - Adds the payment amount to the escrow.

3. **setConditionMet()**
   - Sets the condition to true, allowing funds release.

4. **releaseFunds()**
   - Transfers funds to the worker if conditions are met.

5. **deleteApplication()**
   - Cancels the escrow and deletes the application, refunding the creator.

---

## Usage

### Prerequisites

1. Install [Node.js](https://nodejs.org/) and npm.
2. Install TEALScript:
   ```bash
   npm install @algorandfoundation/tealscript
3. [AlgoKit](https://github.com/algorandfoundation/algokit) (v2.4.2+)
4. [Algorand Sandbox](https://github.com/algorand/sandbox) or a similar local test environment for testing smart contracts.

---

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Srikarnivas/Decentralized_ecrow_service.git

### Demo video with Web3 implementation

follow the link for clear instructions 
https://drive.google.com/file/d/1y2BnuitiimDfqQinP5N-RocTBoyaHzvj/view?usp=sharing


