# Rootstock Multisig Wallet - Frontend

Next.js frontend application for interacting with the Rootstock Multisig Wallet smart contract.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MetaMask browser extension
- Rootstock Testnet RBTC (for gas fees)

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and update:

- `NEXT_PUBLIC_MULTISIG_ADDRESS` - Your deployed contract address (from Foundry deployment)
- `NEXT_PUBLIC_RPC_URL` - Rootstock Testnet RPC URL (default: public RPC)
- `NEXT_PUBLIC_CHAIN_ID` - Chain ID (31 for testnet, 30 for mainnet)

3. **Copy the ABI file:**

The ABI should already be in `src/abi/MultiSigWallet.json`. If you need to update it:

```bash
# From the contracts directory
cp ../contracts/out/MultiSigWallet.sol/MultiSigWallet.json src/abi/
# Then extract just the ABI:
node -e "const abi = require('./src/abi/MultiSigWallet.json'); console.log(JSON.stringify(abi.abi, null, 2))" > src/abi/MultiSigWallet.json
```

Or use the helper script (see below).

4. **Run the development server:**

```bash
npm run dev
```

5. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Getting the ABI

The ABI (Application Binary Interface) is required for the frontend to interact with the smart contract.

### Option 1: Copy from Foundry output (Recommended)

After compiling your contracts with Foundry, copy the ABI:

```bash
# From the frontend directory
cp ../contracts/out/MultiSigWallet.sol/MultiSigWallet.json src/abi/
```

Then extract just the `abi` field from the JSON file. The file should contain only the ABI array, not the full artifact.

You can extract it with:

```bash
cd src/abi
node -e "const data = require('./MultiSigWallet.json'); require('fs').writeFileSync('./MultiSigWallet.json', JSON.stringify(data.abi, null, 2))"
```

### Option 2: Use the helper script

Create a script `scripts/copy-abi.sh`:

```bash
#!/bin/bash
# Copy ABI from Foundry output to frontend
CONTRACTS_DIR="../contracts"
FRONTEND_DIR="."

# Copy the full artifact
cp "$CONTRACTS_DIR/out/MultiSigWallet.sol/MultiSigWallet.json" "$FRONTEND_DIR/src/abi/MultiSigWallet.full.json"

# Extract just the ABI
node -e "const data = require('./src/abi/MultiSigWallet.full.json'); const fs = require('fs'); fs.writeFileSync('./src/abi/MultiSigWallet.json', JSON.stringify(data.abi, null, 2))"

echo "✅ ABI copied successfully!"
```

Make it executable and run:

```bash
chmod +x scripts/copy-abi.sh
./scripts/copy-abi.sh
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
# Rootstock Testnet RPC URL
NEXT_PUBLIC_RPC_URL=https://public-node.testnet.rsk.co

# Chain ID (31 = Testnet, 30 = Mainnet)
NEXT_PUBLIC_CHAIN_ID=31

# Your deployed Multisig Wallet contract address
NEXT_PUBLIC_MULTISIG_ADDRESS=0x3886eC7a6ca3841944a27439126096d6978f8884

# Explorer URL (optional)
NEXT_PUBLIC_EXPLORER_URL=https://explorer.testnet.rsk.co
```

### Contract Address

Update `NEXT_PUBLIC_MULTISIG_ADDRESS` with your deployed contract address from the Foundry deployment.

You can also modify `src/lib/contract.ts` directly, but using environment variables is recommended.

## 🔗 Connecting MetaMask to Rootstock Testnet

If MetaMask doesn't have Rootstock Testnet configured:

1. Open MetaMask
2. Click the network dropdown
3. Select "Add Network" or "Add Network Manually"
4. Enter the following details:

**Network Name:** Rootstock Testnet  
**RPC URL:** `https://public-node.testnet.rsk.co`  
**Chain ID:** `31`  
**Currency Symbol:** `RBTC`  
**Block Explorer URL:** `https://explorer.testnet.rsk.co`

5. Click "Save"

## 💻 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── layout.tsx    # Root layout with providers
│   │   ├── page.tsx      # Home page
│   │   ├── providers.tsx # Wagmi & React Query providers
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── ConnectButton.tsx    # Wallet connection
│   │   ├── SubmitTxForm.tsx     # Transaction submission form
│   │   ├── TxList.tsx           # Transaction list
│   │   └── TransactionItem.tsx  # Individual transaction item
│   ├── lib/              # Utilities
│   │   ├── contract.ts   # Contract configuration & ABI
│   │   └── utils.ts      # Helper functions
│   └── abi/              # Contract ABIs
│       └── MultiSigWallet.json
├── .env.local.example    # Environment variables template
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## 🎯 Features

- ✅ Connect MetaMask wallet
- ✅ View multisig wallet information (owners, confirmations, balance)
- ✅ Submit new transactions
- ✅ View all transactions with status
- ✅ Approve/Revoke transaction confirmations (owners only)
- ✅ Execute transactions when enough confirmations (owners only)
- ✅ Real-time transaction updates (polls every 8 seconds)
- ✅ Transaction status indicators
- ✅ Responsive design with Tailwind CSS

## 📝 Usage Guide

### For Owners

1. **Connect Wallet:** Click "Connect Wallet" and approve in MetaMask
2. **Submit Transaction:**
   - Fill in recipient address
   - Enter amount in RBTC
   - Optionally add data (hex string, leave empty for simple transfer)
   - Click "Submit Transaction"
3. **Approve Transaction:**
   - Find the transaction in the list
   - Click "Approve" button
   - Confirm in MetaMask
4. **Execute Transaction:**
   - When enough owners have approved (meets required confirmations)
   - The "Execute" button will appear
   - Make sure the multisig contract itself has enough RBTC to cover the transaction Amount (otherwise `executeTransaction` will revert)
   - Click "Execute" and confirm in MetaMask

### For Non-Owners

- You can view the contract and transactions
- You cannot submit, approve, or execute transactions
- A warning message will be displayed

## 🔒 Security Notes

- Always verify the contract address before connecting
- Double-check transaction details before approving
- This is a demo application - use at your own risk
- For production use, consider additional security measures

## 🐛 Troubleshooting

### "Failed to connect to wallet"

- Make sure MetaMask is installed and unlocked
- Check that you're on the correct network (Rootstock Testnet)
- Try refreshing the page

### "Contract not found"

- Verify the contract address in `.env.local`
- Make sure the contract is deployed on Rootstock Testnet
- Check the contract address on the explorer

### "Transaction failed"

- Check you have enough RBTC for gas
- Verify you're an owner of the multisig wallet
- Check transaction requirements (enough confirmations, not already executed)
- Also fund the multisig contract address with RBTC (the contract balance must be >= the transaction Amount)

### "Cannot read properties"

- Make sure the ABI file is properly formatted (JSON array)
- Verify the ABI matches the deployed contract
- Try rebuilding: `npm run build`

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)
- [Rootstock Documentation](https://developers.rsk.co/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for Rootstock (RSK)**

## 📊 Frontend Architecture Diagram

The following diagram illustrates the frontend architecture and data flow:

```mermaid
graph TB
    User[User Browser] --> MetaMask[MetaMask Wallet]
    MetaMask --> Wagmi[Wagmi Provider]
    Wagmi --> Viem[Viem Client]
    Viem --> RPC[Rootstock RPC Node]
    
    NextApp[Next.js App] --> Providers[Wagmi & React Query Providers]
    Providers --> Wagmi
    
    NextApp --> HomePage[Home Page]
    HomePage --> Hero[Hero Section]
    HomePage --> Stats[Stats Cards]
    HomePage --> Dashboard[Wallet Dashboard]
    HomePage --> OwnersList[Owners List]
    HomePage --> SubmitForm[Submit Transaction Form]
    HomePage --> TxList[Transaction List]
    
    SubmitForm --> useWriteContract[useWriteContract Hook]
    useWriteContract --> Contract[MultiSigWallet Contract]
    
    TxList --> useReadContract[useReadContract Hook]
    useReadContract --> Contract
    
    TxList --> Polling[Polling every 8s]
    Polling --> useReadContract
    
    TxList --> TxItem[Transaction Item]
    TxItem --> ApproveBtn[Approve Button]
    TxItem --> RevokeBtn[Revoke Button]
    TxItem --> ExecuteBtn[Execute Button]
    
    ApproveBtn --> useWriteContract
    RevokeBtn --> useWriteContract
    ExecuteBtn --> useWriteContract
    
    useWriteContract --> useWaitForTransaction[useWaitForTransaction]
    useWaitForTransaction --> Toast[Toast Notification]
    Toast --> User
    
    Contract --> Events[Contract Events]
    Events --> RPC
    
    style User fill:#e1f5ff
    style Contract fill:#fff3cd
    style NextApp fill:#d4edda
    style Toast fill:#d1ecf1
```

## 🔄 User Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant M as MetaMask
    participant F as Frontend
    participant W as Wagmi
    participant C as Contract
    
    U->>M: Click "Connect Wallet"
    M->>U: Request Connection
    U->>M: Approve
    M->>W: Wallet Connected
    W->>F: Update Connection State
    
    F->>C: Check if User is Owner
    C-->>F: Return isOwner status
    
    alt User is Owner
        U->>F: Fill Transaction Form
        F->>W: submitTransaction(to, value, data)
        W->>M: Request Transaction Signature
        M->>U: Show Transaction Details
        U->>M: Approve Transaction
        M->>C: Submit Transaction
        C-->>F: Emit SubmitTransaction Event
        F->>F: Add Transaction to List
        
        U->>F: Click "Approve" on Transaction
        F->>W: confirmTransaction(txId)
        W->>M: Request Signature
        U->>M: Approve
        M->>C: Confirm Transaction
        C-->>F: Emit ConfirmTransaction Event
        F->>F: Update Confirmation Count
        
        alt Enough Confirmations
            U->>F: Click "Execute"
            F->>W: executeTransaction(txId)
            W->>M: Request Signature
            U->>M: Approve
            M->>C: Execute Transaction
            C->>C: Transfer RBTC
            C-->>F: Emit ExecuteTransaction Event
            F->>F: Update Transaction Status
        end
    else User is Not Owner
        F->>U: Show "Not an Owner" Message
    end
    
    F->>C: Poll Transaction Data (every 8s)
    C-->>F: Return Updated Transaction State
    F->>F: Update UI
```

## 🏗️ Component Architecture

```mermaid
graph LR
    subgraph "Next.js App Router"
        Layout[layout.tsx]
        Page[page.tsx]
        Providers[providers.tsx]
    end
    
    subgraph "Components"
        Navigation[Navigation]
        Hero[Hero]
        Footer[Footer]
        ConnectBtn[ConnectButton]
        SubmitForm[SubmitTxForm]
        TxList[TxList]
        TxItem[TransactionItem]
        OwnersList[OwnersList]
        Dashboard[WalletDashboard]
        Stats[StatsCards]
    end
    
    subgraph "Hooks & Utils"
        WagmiHooks[useAccount<br/>useReadContract<br/>useWriteContract<br/>useWaitForTransaction]
        Utils[formatRBTC<br/>truncateAddress<br/>getExplorerUrl]
        Contract[contract.ts<br/>MULTISIG_ABI]
    end
    
    subgraph "External"
        MetaMask[MetaMask]
        Rootstock[Rootstock Network]
    end
    
    Layout --> Providers
    Providers --> Page
    Page --> Navigation
    Page --> Hero
    Page --> Stats
    Page --> Dashboard
    Page --> OwnersList
    Page --> SubmitForm
    Page --> TxList
    Page --> Footer
    
    TxList --> TxItem
    
    ConnectBtn --> WagmiHooks
    SubmitForm --> WagmiHooks
    TxItem --> WagmiHooks
    OwnersList --> WagmiHooks
    Dashboard --> WagmiHooks
    
    WagmiHooks --> Contract
    WagmiHooks --> MetaMask
    Utils --> Contract
    
    MetaMask --> Rootstock
    
    style Providers fill:#d1ecf1
    style WagmiHooks fill:#fff3cd
    style Contract fill:#d4edda
    style Rootstock fill:#e1f5ff
```

## 📱 Page Structure

```mermaid
graph TD
    App[Root Layout] --> Nav[Navigation Bar]
    App --> Main[Main Content]
    App --> Footer[Footer]
    
    Main --> Hero[Hero Section<br/>Title, Description, CTA]
    Main --> Stats[Stats Cards<br/>Transactions, TVL, Owners, Network]
    Main --> Dashboard[Wallet Dashboard<br/>Charts & Analytics]
    Main --> Owners[Owners List<br/>Owner Addresses & Status]
    Main --> Content[Content Grid]
    
    Content --> Left[Left Column]
    Content --> Right[Right Column]
    
    Left --> Submit[Submit Transaction Form<br/>Recipient, Amount, Data]
    Right --> TxList[Transaction List<br/>Filter, Search, Items]
    
    TxList --> Filters[Filters: All/Pending/Executed]
    TxList --> Search[Search Bar]
    TxList --> Items[Transaction Items]
    
    Items --> Item[Transaction Item<br/>Details, Actions, Status]
    
    Item --> Approve[Approve Button]
    Item --> Revoke[Revoke Button]
    Item --> Execute[Execute Button]
    Item --> Modal[Details Modal]
    
    style App fill:#e1f5ff
    style Main fill:#d4edda
    style Item fill:#fff3cd
```
