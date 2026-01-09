// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {MultiSigWallet} from "../src/MultiSigWallet.sol";

contract MultiSigWalletTest is Test {
    MultiSigWallet public multisig;

    // Test accounts
    address public owner1;
    address public owner2;
    address public owner3;
    address public nonOwner;
    address public recipient;

    // Constants
    uint256 public constant REQUIRED_CONFIRMATIONS = 2;
    uint256 public constant INITIAL_BALANCE = 1 ether;
    uint256 public constant TRANSFER_AMOUNT = 0.01 ether;

    // Events
    event SubmitTransaction(uint256 indexed txId, address indexed from, address indexed to, uint256 value, bytes data);

    event ConfirmTransaction(uint256 indexed txId, address indexed owner);
    event RevokeConfirmation(uint256 indexed txId, address indexed owner);
    event ExecuteTransaction(uint256 indexed txId, address indexed to, uint256 value, bytes data);

    function setUp() public {
        // Create test accounts
        owner1 = address(0x1);
        owner2 = address(0x2);
        owner3 = address(0x3);
        nonOwner = address(0x4);
        recipient = address(0x5);

        // Deal ETH to test accounts
        vm.deal(owner1, INITIAL_BALANCE);
        vm.deal(owner2, INITIAL_BALANCE);
        vm.deal(owner3, INITIAL_BALANCE);
        vm.deal(nonOwner, INITIAL_BALANCE);

        // Create owners array
        address[] memory owners = new address[](3);
        owners[0] = owner1;
        owners[1] = owner2;
        owners[2] = owner3;

        // Deploy multisig wallet
        vm.prank(owner1);
        multisig = new MultiSigWallet(owners, REQUIRED_CONFIRMATIONS);

        // Fund the multisig wallet
        vm.deal(address(multisig), INITIAL_BALANCE);
    }

    // ============ Constructor Tests ============

    function test_DeployWith3OwnersRequires2() public {
        address[] memory owners = new address[](3);
        owners[0] = owner1;
        owners[1] = owner2;
        owners[2] = owner3;

        MultiSigWallet newMultisig = new MultiSigWallet(owners, 2);

        assertEq(newMultisig.getOwnerCount(), 3);
        assertEq(newMultisig.requiredConfirmations(), 2);
        assertTrue(newMultisig.isOwner(owner1));
        assertTrue(newMultisig.isOwner(owner2));
        assertTrue(newMultisig.isOwner(owner3));
    }

    function test_RevertIfOwnersArrayEmpty() public {
        address[] memory owners = new address[](0);

        vm.expectRevert(MultiSigWallet.OwnersRequired.selector);
        new MultiSigWallet(owners, 1);
    }

    function test_RevertIfRequiredConfirmationsZero() public {
        address[] memory owners = new address[](1);
        owners[0] = owner1;

        vm.expectRevert(MultiSigWallet.InvalidRequiredConfirmations.selector);
        new MultiSigWallet(owners, 0);
    }

    function test_RevertIfRequiredConfirmationsGreaterThanOwners() public {
        address[] memory owners = new address[](2);
        owners[0] = owner1;
        owners[1] = owner2;

        vm.expectRevert(MultiSigWallet.InvalidRequiredConfirmations.selector);
        new MultiSigWallet(owners, 3);
    }

    function test_RevertIfDuplicateOwners() public {
        address[] memory owners = new address[](2);
        owners[0] = owner1;
        owners[1] = owner1; // Duplicate

        vm.expectRevert(MultiSigWallet.AlreadyOwner.selector);
        new MultiSigWallet(owners, 1);
    }

    function test_RevertIfZeroAddressOwner() public {
        address[] memory owners = new address[](2);
        owners[0] = owner1;
        owners[1] = address(0);

        vm.expectRevert(MultiSigWallet.ZeroAddressNotAllowed.selector);
        new MultiSigWallet(owners, 1);
    }

    // ============ Submit Transaction Tests ============

    function test_Owner1SubmitsTransaction() public {
        vm.prank(owner1);
        uint256 txId = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        assertEq(txId, 0);

        (address to, uint256 value, bytes memory data, bool executed, uint256 numConfirmations) =
            multisig.getTransaction(0);

        assertEq(to, recipient);
        assertEq(value, TRANSFER_AMOUNT);
        assertEq(data.length, 0);
        assertFalse(executed);
        assertEq(numConfirmations, 0);
    }

    function test_SubmitTransactionEmitsEvent() public {
        vm.prank(owner1);
        vm.expectEmit(true, true, true, true);
        emit SubmitTransaction(0, owner1, recipient, TRANSFER_AMOUNT, "");
        multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");
    }

    function test_RevertIfNonOwnerSubmitsTransaction() public {
        vm.prank(nonOwner);
        vm.expectRevert(MultiSigWallet.NotOwner.selector);
        multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");
    }

    function test_RevertIfSubmitTransactionToZeroAddress() public {
        vm.prank(owner1);
        vm.expectRevert(MultiSigWallet.InvalidRecipient.selector);
        multisig.submitTransaction(address(0), TRANSFER_AMOUNT, "");
    }

    function test_SubmitMultipleTransactions() public {
        vm.prank(owner1);
        uint256 txId1 = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");
        assertEq(txId1, 0);

        vm.prank(owner2);
        uint256 txId2 = multisig.submitTransaction(recipient, TRANSFER_AMOUNT * 2, "");
        assertEq(txId2, 1);

        assertEq(multisig.getTransactionCount(), 2);
    }

    // ============ Confirm Transaction Tests ============

    function test_Owner2ConfirmsTransaction() public {
        // Submit transaction
        vm.prank(owner1);
        uint256 txId = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        // Confirm transaction
        vm.prank(owner2);
        multisig.confirmTransaction(txId);

        (,,, bool executed, uint256 numConfirmations) = multisig.getTransaction(txId);
        assertFalse(executed);
        assertEq(numConfirmations, 1);
        assertTrue(multisig.isConfirmed(txId, owner2));
    }

    function test_ConfirmTransactionEmitsEvent() public {
        vm.prank(owner1);
        uint256 txId = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        vm.prank(owner2);
        vm.expectEmit(true, true, false, false);
        emit ConfirmTransaction(txId, owner2);
        multisig.confirmTransaction(txId);
    }

    function test_RevertIfNonOwnerConfirms() public {
        vm.prank(owner1);
        uint256 txId = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        vm.prank(nonOwner);
        vm.expectRevert(MultiSigWallet.NotOwner.selector);
        multisig.confirmTransaction(txId);
    }

    function test_RevertIfConfirmAlreadyConfirmed() public {
        vm.prank(owner1);
        uint256 txId = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        vm.prank(owner2);
        multisig.confirmTransaction(txId);

        vm.prank(owner2);
        vm.expectRevert(MultiSigWallet.TxAlreadyConfirmed.selector);
        multisig.confirmTransaction(txId);
    }

    function test_RevertIfConfirmNonExistentTransaction() public {
        vm.prank(owner1);
        vm.expectRevert(MultiSigWallet.TxDoesNotExist.selector);
        multisig.confirmTransaction(999);
    }

    function test_RevertIfConfirmExecutedTransaction() public {
        // Setup: submit, confirm twice, execute
        vm.prank(owner1);
        uint256 txId = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        vm.prank(owner1);
        multisig.confirmTransaction(txId);

        vm.prank(owner2);
        multisig.confirmTransaction(txId);

        vm.prank(owner1);
        multisig.executeTransaction(txId);

        // Try to confirm executed transaction
        vm.prank(owner3);
        vm.expectRevert(MultiSigWallet.TxAlreadyExecuted.selector);
        multisig.confirmTransaction(txId);
    }

    // ============ Execute Transaction Tests ============

    function test_ExecuteTransactionWithEnoughConfirmations() public {
        uint256 recipientBalanceBefore = recipient.balance;

        // Submit transaction
        vm.prank(owner1);
        uint256 txId = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        // Confirm by owner1
        vm.prank(owner1);
        multisig.confirmTransaction(txId);

        // Confirm by owner2
        vm.prank(owner2);
        multisig.confirmTransaction(txId);

        // Execute transaction
        vm.prank(owner1);
        multisig.executeTransaction(txId);

        // Check transaction is executed
        (,,, bool executed, uint256 numConfirmations) = multisig.getTransaction(txId);
        assertTrue(executed);
        assertEq(numConfirmations, 2);

        // Check recipient received funds
        assertEq(recipient.balance, recipientBalanceBefore + TRANSFER_AMOUNT);
    }

    function test_ExecuteTransactionEmitsEvent() public {
        vm.prank(owner1);
        uint256 txId = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        vm.prank(owner1);
        multisig.confirmTransaction(txId);

        vm.prank(owner2);
        multisig.confirmTransaction(txId);

        vm.prank(owner1);
        vm.expectEmit(true, true, true, true);
        emit ExecuteTransaction(txId, recipient, TRANSFER_AMOUNT, "");
        multisig.executeTransaction(txId);
    }

    function test_RevertIfExecuteWithoutEnoughConfirmations() public {
        vm.prank(owner1);
        uint256 txId = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        // Only one confirmation (need 2)
        vm.prank(owner1);
        multisig.confirmTransaction(txId);

        vm.prank(owner1);
        vm.expectRevert(MultiSigWallet.InsufficientConfirmations.selector);
        multisig.executeTransaction(txId);
    }

    function test_RevertIfExecuteNonExistentTransaction() public {
        vm.prank(owner1);
        vm.expectRevert(MultiSigWallet.TxDoesNotExist.selector);
        multisig.executeTransaction(999);
    }

    function test_RevertIfExecuteAlreadyExecuted() public {
        // Setup and execute
        vm.prank(owner1);
        uint256 txId = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        vm.prank(owner1);
        multisig.confirmTransaction(txId);

        vm.prank(owner2);
        multisig.confirmTransaction(txId);

        vm.prank(owner1);
        multisig.executeTransaction(txId);

        // Try to execute again
        vm.prank(owner1);
        vm.expectRevert(MultiSigWallet.TxAlreadyExecuted.selector);
        multisig.executeTransaction(txId);
    }

    function test_RevertIfNonOwnerExecutes() public {
        vm.prank(owner1);
        uint256 txId = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        vm.prank(owner1);
        multisig.confirmTransaction(txId);

        vm.prank(owner2);
        multisig.confirmTransaction(txId);

        vm.prank(nonOwner);
        vm.expectRevert(MultiSigWallet.NotOwner.selector);
        multisig.executeTransaction(txId);
    }

    // ============ Revoke Confirmation Tests ============

    function test_RevokeConfirmation() public {
        vm.prank(owner1);
        uint256 txId = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        // Confirm
        vm.prank(owner2);
        multisig.confirmTransaction(txId);

        // Revoke
        vm.prank(owner2);
        multisig.revokeConfirmation(txId);

        (,,, bool executed, uint256 numConfirmations) = multisig.getTransaction(txId);
        assertFalse(executed);
        assertEq(numConfirmations, 0);
        assertFalse(multisig.isConfirmed(txId, owner2));
    }

    function test_RevokeConfirmationEmitsEvent() public {
        vm.prank(owner1);
        uint256 txId = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        vm.prank(owner2);
        multisig.confirmTransaction(txId);

        vm.prank(owner2);
        vm.expectEmit(true, true, false, false);
        emit RevokeConfirmation(txId, owner2);
        multisig.revokeConfirmation(txId);
    }

    function test_RevokeThenExecutionFails() public {
        vm.prank(owner1);
        uint256 txId = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        // Two confirmations
        vm.prank(owner1);
        multisig.confirmTransaction(txId);

        vm.prank(owner2);
        multisig.confirmTransaction(txId);

        // Owner2 revokes
        vm.prank(owner2);
        multisig.revokeConfirmation(txId);

        // Now execution should fail (only 1 confirmation, need 2)
        vm.prank(owner1);
        vm.expectRevert(MultiSigWallet.InsufficientConfirmations.selector);
        multisig.executeTransaction(txId);
    }

    function test_RevertIfRevokeNonExistentTransaction() public {
        vm.prank(owner1);
        vm.expectRevert(MultiSigWallet.TxDoesNotExist.selector);
        multisig.revokeConfirmation(999);
    }

    function test_RevertIfRevokeNotConfirmed() public {
        vm.prank(owner1);
        uint256 txId = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        // Owner2 never confirmed, so can't revoke
        vm.prank(owner2);
        vm.expectRevert(MultiSigWallet.TxNotConfirmed.selector);
        multisig.revokeConfirmation(txId);
    }

    function test_RevertIfRevokeExecutedTransaction() public {
        // Setup and execute
        vm.prank(owner1);
        uint256 txId = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        vm.prank(owner1);
        multisig.confirmTransaction(txId);

        vm.prank(owner2);
        multisig.confirmTransaction(txId);

        vm.prank(owner1);
        multisig.executeTransaction(txId);

        // Try to revoke after execution
        vm.prank(owner2);
        vm.expectRevert(MultiSigWallet.TxAlreadyExecuted.selector);
        multisig.revokeConfirmation(txId);
    }

    // ============ Integration Tests ============

    function test_FullFlow_Owner1Submits_Owner2AndOwner3Confirm_Owner1Executes() public {
        uint256 recipientBalanceBefore = recipient.balance;

        // Owner1 submits
        vm.prank(owner1);
        uint256 txId = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        // Owner2 confirms
        vm.prank(owner2);
        multisig.confirmTransaction(txId);

        // Owner3 confirms
        vm.prank(owner3);
        multisig.confirmTransaction(txId);

        // Owner1 executes
        vm.prank(owner1);
        multisig.executeTransaction(txId);

        // Verify
        (,,, bool executed, uint256 numConfirmations) = multisig.getTransaction(txId);
        assertTrue(executed);
        assertEq(numConfirmations, 2); // Owner2 and Owner3, not Owner1

        // Verify funds transferred
        assertEq(recipient.balance, recipientBalanceBefore + TRANSFER_AMOUNT);
    }

    function test_FullFlow_Owner2Submits_Owner1AndOwner3Confirm_Owner2Executes() public {
        uint256 recipientBalanceBefore = recipient.balance;

        // Owner2 submits (note: submitter doesn't auto-confirm)
        vm.prank(owner2);
        uint256 txId = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        // Owner1 confirms
        vm.prank(owner1);
        multisig.confirmTransaction(txId);

        // Owner3 confirms
        vm.prank(owner3);
        multisig.confirmTransaction(txId);

        // Owner2 executes
        vm.prank(owner2);
        multisig.executeTransaction(txId);

        // Verify execution
        (,,, bool executed,) = multisig.getTransaction(txId);
        assertTrue(executed);
        assertEq(recipient.balance, recipientBalanceBefore + TRANSFER_AMOUNT);
    }

    function test_MultipleTransactions() public {
        // Transaction 1
        vm.prank(owner1);
        uint256 txId1 = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        vm.prank(owner1);
        multisig.confirmTransaction(txId1);

        vm.prank(owner2);
        multisig.confirmTransaction(txId1);

        // Transaction 2
        vm.prank(owner2);
        uint256 txId2 = multisig.submitTransaction(recipient, TRANSFER_AMOUNT * 2, "");

        vm.prank(owner1);
        multisig.confirmTransaction(txId2);

        vm.prank(owner3);
        multisig.confirmTransaction(txId2);

        // Execute transaction 1
        vm.prank(owner1);
        multisig.executeTransaction(txId1);

        // Execute transaction 2
        vm.prank(owner2);
        multisig.executeTransaction(txId2);

        // Verify both executed
        (,,, bool executed1,) = multisig.getTransaction(txId1);
        (,,, bool executed2,) = multisig.getTransaction(txId2);
        assertTrue(executed1);
        assertTrue(executed2);
    }

    // ============ View Function Tests ============

    function test_GetTransactionCount() public {
        assertEq(multisig.getTransactionCount(), 0);

        vm.prank(owner1);
        multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");
        assertEq(multisig.getTransactionCount(), 1);

        vm.prank(owner2);
        multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");
        assertEq(multisig.getTransactionCount(), 2);
    }

    function test_GetOwnerCount() public view {
        assertEq(multisig.getOwnerCount(), 3);
    }

    function test_IsConfirmed() public {
        vm.prank(owner1);
        uint256 txId = multisig.submitTransaction(recipient, TRANSFER_AMOUNT, "");

        assertFalse(multisig.isConfirmed(txId, owner1));
        assertFalse(multisig.isConfirmed(txId, owner2));

        vm.prank(owner2);
        multisig.confirmTransaction(txId);

        assertFalse(multisig.isConfirmed(txId, owner1));
        assertTrue(multisig.isConfirmed(txId, owner2));
    }

    function test_ReceiveFunction() public {
        uint256 balanceBefore = address(multisig).balance;

        vm.deal(nonOwner, 1 ether);
        vm.prank(nonOwner);
        (bool success,) = address(multisig).call{value: 0.5 ether}("");

        assertTrue(success);
        assertEq(address(multisig).balance, balanceBefore + 0.5 ether);
    }
}
