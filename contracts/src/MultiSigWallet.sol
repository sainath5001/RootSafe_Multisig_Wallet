// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MultiSigWallet
 * @dev A multisignature wallet contract that requires multiple owner approvals before executing transactions
 * @notice This contract allows a group of owners to control a wallet, requiring M out of N approvals to execute transactions
 */
contract MultiSigWallet is ReentrancyGuard {
    // ============ Events ============

    /// @dev Emitted when a new transaction is submitted
    /// @param txId The transaction ID
    /// @param from The address that submitted the transaction
    /// @param to The recipient address
    /// @param value The amount of RBTC/ETH to send
    /// @param data The transaction data
    event SubmitTransaction(uint256 indexed txId, address indexed from, address indexed to, uint256 value, bytes data);

    /// @dev Emitted when an owner confirms a transaction
    /// @param txId The transaction ID
    /// @param owner The address that confirmed the transaction
    event ConfirmTransaction(uint256 indexed txId, address indexed owner);

    /// @dev Emitted when an owner revokes their confirmation
    /// @param txId The transaction ID
    /// @param owner The address that revoked their confirmation
    event RevokeConfirmation(uint256 indexed txId, address indexed owner);

    /// @dev Emitted when a transaction is executed
    /// @param txId The transaction ID
    /// @param to The recipient address
    /// @param value The amount of RBTC/ETH sent
    /// @param data The transaction data
    event ExecuteTransaction(uint256 indexed txId, address indexed to, uint256 value, bytes data);

    /// @dev Emitted when an owner is added to the wallet
    /// @param owner The address of the owner that was added
    event OwnerAdded(address indexed owner);

    // ============ Errors ============

    /// @dev Thrown when the caller is not an owner
    error NotOwner();

    /// @dev Thrown when transaction does not exist
    error TxDoesNotExist();

    /// @dev Thrown when transaction has already been executed
    error TxAlreadyExecuted();

    /// @dev Thrown when transaction has not been confirmed by the caller (for revoke)
    error TxNotConfirmed();

    /// @dev Thrown when transaction has already been confirmed by the caller
    error TxAlreadyConfirmed();

    /// @dev Thrown when transaction does not have enough confirmations
    error InsufficientConfirmations();

    /// @dev Thrown when address is already an owner
    error AlreadyOwner();

    /// @dev Thrown when address is not an owner
    error NotAnOwner();

    /// @dev Thrown when zero address is provided (not allowed)
    error ZeroAddressNotAllowed();

    /// @dev Thrown when recipient address is zero (prevents fund burning)
    error InvalidRecipient();

    /// @dev Thrown when owners array is empty
    error OwnersRequired();

    /// @dev Thrown when required confirmations is zero or greater than number of owners
    error InvalidRequiredConfirmations();

    /// @dev Thrown when transaction execution fails
    error TxExecutionFailed();

    // ============ Structs ============

    /// @dev Represents a transaction that can be executed by the multisig wallet
    struct Transaction {
        address to; // Recipient address
        uint256 value; // Amount of RBTC/ETH to send
        bytes data; // Transaction data (for contract calls)
        bool executed; // Whether the transaction has been executed
        uint256 numConfirmations; // Number of confirmations received
    }

    // ============ State Variables ============

    /// @dev Array of all owners
    address[] public owners;

    /// @dev Mapping from owner address to whether they are an owner
    mapping(address => bool) public isOwner;

    /// @dev Number of required confirmations to execute a transaction
    uint256 public requiredConfirmations;

    /// @dev Array of all transactions
    /// @notice This array grows indefinitely. For production use, consider implementing pagination
    /// or limiting the number of transactions. The frontend polls all transactions which could
    /// become expensive as the array grows.
    Transaction[] public transactions;

    /// @dev Mapping from transaction ID to mapping of owner address to whether they confirmed
    mapping(uint256 => mapping(address => bool)) public confirmations;

    // ============ Modifiers ============

    /// @dev Ensures the caller is an owner
    modifier onlyOwner() {
        if (!isOwner[msg.sender]) revert NotOwner();
        _;
    }

    /// @dev Ensures the transaction exists
    modifier txExists(uint256 _txId) {
        if (_txId >= transactions.length) revert TxDoesNotExist();
        _;
    }

    /// @dev Ensures the transaction has not been executed
    modifier notExecuted(uint256 _txId) {
        if (transactions[_txId].executed) revert TxAlreadyExecuted();
        _;
    }

    /// @dev Ensures the caller has not already confirmed the transaction
    modifier notConfirmed(uint256 _txId) {
        if (confirmations[_txId][msg.sender]) revert TxAlreadyConfirmed();
        _;
    }

    // ============ Constructor ============

    /// @dev Initializes the multisig wallet with owners and required confirmations
    /// @param _owners Array of owner addresses
    /// @param _requiredConfirmations Number of confirmations required to execute a transaction
    /// @notice Reverts if owners array is empty, required confirmations is 0, or required confirmations exceeds number of owners
    constructor(address[] memory _owners, uint256 _requiredConfirmations) {
        if (_owners.length == 0) revert OwnersRequired();
        if (_requiredConfirmations == 0 || _requiredConfirmations > _owners.length) {
            revert InvalidRequiredConfirmations();
        }

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            // Prevent zero address
            if (owner == address(0)) {
                revert ZeroAddressNotAllowed();
            }

            // Prevent duplicate owners
            if (isOwner[owner]) {
                revert AlreadyOwner();
            }

            isOwner[owner] = true;
            owners.push(owner);
            emit OwnerAdded(owner);
        }

        requiredConfirmations = _requiredConfirmations;
    }

    // ============ Receive Function ============

    /// @dev Allows the contract to receive RBTC/ETH
    receive() external payable {}

    // ============ External Functions ============

    /// @dev Submits a new transaction to be executed by the multisig wallet
    /// @param _to The recipient address
    /// @param _value The amount of RBTC/ETH to send (in wei)
    /// @param _data The transaction data (for contract calls, empty for simple transfers)
    /// @return txId The ID of the newly created transaction
    /// @notice Only owners can submit transactions
    /// @notice Reverts if recipient is zero address to prevent fund burning
    function submitTransaction(address _to, uint256 _value, bytes calldata _data)
        external
        onlyOwner
        returns (uint256 txId)
    {
        // Prevent sending funds to zero address (permanent fund burning)
        if (_to == address(0)) {
            revert InvalidRecipient();
        }

        txId = transactions.length;

        transactions.push(Transaction({to: _to, value: _value, data: _data, executed: false, numConfirmations: 0}));

        emit SubmitTransaction(txId, msg.sender, _to, _value, _data);
    }

    /// @dev Confirms a transaction
    /// @param _txId The transaction ID to confirm
    /// @notice Only owners can confirm transactions, and they can only confirm once per transaction
    function confirmTransaction(uint256 _txId)
        external
        onlyOwner
        txExists(_txId)
        notExecuted(_txId)
        notConfirmed(_txId)
    {
        Transaction storage transaction = transactions[_txId];
        confirmations[_txId][msg.sender] = true;
        transaction.numConfirmations += 1;

        emit ConfirmTransaction(_txId, msg.sender);
    }

    /// @dev Revokes a confirmation for a transaction
    /// @param _txId The transaction ID to revoke confirmation for
    /// @notice Only owners who have confirmed can revoke, and only before execution
    function revokeConfirmation(uint256 _txId) external onlyOwner txExists(_txId) notExecuted(_txId) {
        if (!confirmations[_txId][msg.sender]) revert TxNotConfirmed();

        Transaction storage transaction = transactions[_txId];
        confirmations[_txId][msg.sender] = false;
        transaction.numConfirmations -= 1;

        emit RevokeConfirmation(_txId, msg.sender);
    }

    /// @dev Executes a transaction if it has enough confirmations
    /// @param _txId The transaction ID to execute
    /// @notice Only executes if the transaction has at least `requiredConfirmations` and has not been executed
    /// @notice Uses ReentrancyGuard to prevent reentrancy attacks
    /// @notice Uses call() for safe ETH/RBTC transfer
    function executeTransaction(uint256 _txId) external onlyOwner txExists(_txId) notExecuted(_txId) nonReentrant {
        Transaction storage transaction = transactions[_txId];

        if (transaction.numConfirmations < requiredConfirmations) {
            revert InsufficientConfirmations();
        }

        transaction.executed = true;

        (bool success,) = transaction.to.call{value: transaction.value}(transaction.data);

        if (!success) revert TxExecutionFailed();

        emit ExecuteTransaction(_txId, transaction.to, transaction.value, transaction.data);
    }

    // ============ View Functions ============

    /// @dev Returns the transaction data for a given transaction ID
    /// @param _txId The transaction ID
    /// @return to The recipient address
    /// @return value The amount of RBTC/ETH to send
    /// @return data The transaction data
    /// @return executed Whether the transaction has been executed
    /// @return numConfirmations The number of confirmations received
    function getTransaction(uint256 _txId)
        external
        view
        returns (address to, uint256 value, bytes memory data, bool executed, uint256 numConfirmations)
    {
        if (_txId >= transactions.length) revert TxDoesNotExist();

        Transaction memory transaction = transactions[_txId];
        return (transaction.to, transaction.value, transaction.data, transaction.executed, transaction.numConfirmations);
    }

    /// @dev Returns the total number of transactions
    /// @return The total number of transactions
    function getTransactionCount() external view returns (uint256) {
        return transactions.length;
    }

    /// @dev Returns the total number of owners
    /// @return The total number of owners
    function getOwnerCount() external view returns (uint256) {
        return owners.length;
    }

    /// @dev Checks if a specific owner has confirmed a transaction
    /// @param _txId The transaction ID
    /// @param _owner The owner address to check
    /// @return Whether the owner has confirmed the transaction
    function isConfirmed(uint256 _txId, address _owner) external view returns (bool) {
        return confirmations[_txId][_owner];
    }
}
