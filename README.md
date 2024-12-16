# AlgoBharatDevTrackCompetition24


# DecentrailizedEscrow

Welcome to your new AlgoKit project!

This is your workspace root. A `workspace` in AlgoKit is an orchestrated collection of standalone projects (backends, smart contracts, frontend apps and etc).

By default, `projects_root_path` parameter is set to `projects`. Which instructs AlgoKit CLI to create a new directory under `projects` directory when new project is instantiated via `algokit init` at the root of the workspace.

## Getting Started

To get started refer to `README.md` files in respective sub-projects in the `projects` directory.

To learn more about algokit, visit [documentation](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/algokit.md).

### GitHub Codespaces

To get started execute:

1. `algokit generate devcontainer` - invoking this command from the root of this repository will create a `devcontainer.json` file with all the configuration needed to run this project in a GitHub codespace. [Run the repository inside a codespace](https://docs.github.com/en/codespaces/getting-started/quickstart) to get started.
2. `algokit init` - invoke this command inside a github codespace to launch an interactive wizard to guide you through the process of creating a new AlgoKit project

Powered by [Copier templates](https://copier.readthedocs.io/en/stable/).



# EscrowService Contract

## Overview
**EscrowService** is a smart contract written in TypeScript using [AlgoKit's TealScript](https://github.com/algorandfoundation/tealscript). It facilitates secure escrow transactions between a contract creator (boss) and a worker, ensuring funds are only released when pre-defined conditions are met.

This contract can be used for scenarios such as:
- Payment for services upon completion.
- Conditional asset transfers.
- Secured transactions requiring a trusted intermediary.

---

## Features
### Core Functionalities:
1. **Create an Escrow Contract**:
   - Define the worker, admin, and escrow parameters during initialization.
2. **Add Funds to Escrow**:
   - Lock funds in the escrow account until conditions are met.
3. **Set Condition**:
   - Allow the boss or admin to set the condition for releasing funds.
4. **Release Funds**:
   - Transfer funds to the worker once conditions are fulfilled.
5. **Cancel and Delete Contract**:
   - Allow the boss to delete the escrow, refunding any remaining funds.

### Access Control:
- **Boss (Creator)**: Can initialize the contract, add funds, set conditions, release funds, and delete the contract.
- **Admin**: Can assist the boss in setting conditions and releasing funds.
- **Worker**: Receives the funds upon meeting the conditions.

---

## Prerequisites
- [Node.js](https://nodejs.org) (v16+)
- [AlgoKit](https://github.com/algorandfoundation/algokit) (v2.4.2+)
- [Algorand Sandbox](https://github.com/algorand/sandbox) or a similar local test environment for testing smart contracts.

---

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Srikarnivas/Decentralized_ecrow_service.git

### Demo video with Web3 implementation

follow the link for clear instructions 
https://drive.google.com/file/d/1y2BnuitiimDfqQinP5N-RocTBoyaHzvj/view?usp=sharing


