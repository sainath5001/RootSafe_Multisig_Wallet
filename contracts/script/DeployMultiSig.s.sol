// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MultiSigWallet} from "../src/MultiSigWallet.sol";

/**
 * @title DeployMultiSig
 * @dev Deployment script for MultiSigWallet on Rootstock testnet
 * @notice This script deploys the MultiSigWallet contract with owners and required confirmations
 * @notice Set ROOTSTOCK_TESTNET_RPC and PRIVATE_KEY environment variables before running
 * @notice Chain ID: 31 (Rootstock Testnet)
 */
contract DeployMultiSig is Script {
    /// @dev Default owners (can be overridden via environment variables)
    address[] private owners;

    /// @dev Default required confirmations
    uint256 private requiredConfirmations;

    function setUp() public {
        // Read owners from environment or use default test addresses
        // Example: OWNERS="0x123...,0x456...,0x789..." (comma-separated)
        string memory ownersEnv = vm.envOr("OWNERS", string(""));

        if (bytes(ownersEnv).length > 0) {
            // Parse comma-separated addresses
            string[] memory ownerStrings = vm.split(ownersEnv, ",");
            owners = new address[](ownerStrings.length);

            for (uint256 i = 0; i < ownerStrings.length; i++) {
                owners[i] = vm.parseAddress(ownerStrings[i]);
            }
        } else {
            // Default: Use test addresses
            // NOTE: In production, always set OWNERS environment variable with real addresses
            owners = new address[](3);
            owners[0] = address(0x742D35CC6634c0532925A3b844BC9E7595F0BEb0); // Example owner 1
            owners[1] = address(0x8BA1f109551Bd432803012645aaC136c22C929E0); // Example owner 2
            owners[2] = address(0x1234567890123456789012345678901234567890); // Example owner 3
        }

        // Read required confirmations from environment or use default
        requiredConfirmations = vm.envOr("REQUIRED_CONFIRMATIONS", uint256(2));

        // Validate required confirmations
        require(requiredConfirmations > 0, "Required confirmations must be > 0");
        require(requiredConfirmations <= owners.length, "Required confirmations must be <= owners count");
    }

    function run() public returns (MultiSigWallet) {
        // Read environment variables
        string memory rpcUrl = vm.envString("ROOTSTOCK_TESTNET_RPC");

        console.log("Deploying MultiSigWallet to Rootstock Testnet...");
        console.log("RPC URL:", rpcUrl);
        console.log("Chain ID: 31");
        console.log("Number of owners:", owners.length);
        console.log("Required confirmations:", requiredConfirmations);

        // Log owners
        for (uint256 i = 0; i < owners.length; i++) {
            console.log("Owner", i, ":", owners[i]);
        }

        // Use private key from --private-key flag
        vm.startBroadcast();

        // Deploy the contract
        MultiSigWallet multisig = new MultiSigWallet(owners, requiredConfirmations);

        vm.stopBroadcast();

        console.log("==========================================");
        console.log("MultiSigWallet deployed successfully!");
        console.log("Contract address:", address(multisig));
        console.log("==========================================");
        console.log("");
        console.log("Next steps:");
        console.log("1. Verify the contract on Rootstock Explorer");
        console.log("2. Fund the multisig wallet with RBTC");
        console.log("3. Test the contract using the frontend interface");
        console.log("");
        console.log("To verify on Rootstock Explorer:");
        console.log("1. Go to https://explorer.testnet.rsk.co/");
        console.log("2. Search for:", address(multisig));
        console.log("3. Click 'Verify and Publish'");
        console.log("4. Use the verification settings from foundry.toml");

        return multisig;
    }
}

/**
 * @notice Example deployment command:
 *
 * forge script script/DeployMultiSig.s.sol:DeployMultiSig \
 *   --rpc-url $ROOTSTOCK_TESTNET_RPC \
 *   --private-key $PRIVATE_KEY \
 *   --broadcast \
 *   --verify \
 *   --etherscan-api-key $ROOTSTOCK_API_KEY
 *
 * @notice To set owners and required confirmations:
 *
 * OWNERS="0x123...,0x456...,0x789..." \
 * REQUIRED_CONFIRMATIONS=2 \
 * forge script script/DeployMultiSig.s.sol:DeployMultiSig \
 *   --rpc-url $ROOTSTOCK_TESTNET_RPC \
 *   --private-key $PRIVATE_KEY \
 *   --broadcast
 *
 * @notice Example Rootstock Testnet RPC URLs:
 * - Public RPC: https://public-node.testnet.rsk.co
 * - QuickNode: https://rsk-testnet.g.alchemy.com/v2/YOUR_API_KEY
 * - Infura: https://rootstock-testnet.infura.io/v3/YOUR_PROJECT_ID
 */
