// SPDX-License-Identifier: MIT
pragma solidity =0.8.20;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';

contract MultisigWallet is Ownable {
    mapping(address => bool) public signers;
    struct Transaction {
        address destination;
        uint256 value;
        bytes data;
        bool executed;
        bool created;
        uint256 approvals;
    }
    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmations;
    uint256 public required;
    uint256 public transactionId = 1;

    error DuplicatedSigner(address owner);
    error InvalidSigner(address owner);
    error InvalidTransaction(uint256 txId);
    error SignerConfirmed(uint256 txId, address signer);
    error SignerNotConfirmed(uint256 txId, address signer);

    event OnTransactionProposed(uint256 txId, address signer);
    event OnTransactionApproved(uint256 txId, address signer);
    event OnTransactionExecuted(uint256 txId);
    event OnTransactionFailure(uint256 txId);

    modifier onlySigner() {
        if (!signers[msg.sender]) revert InvalidSigner(msg.sender);
        _;
    }

    modifier validTransaction(uint256 txId, address signer) {
        if (!transactions[txId].created) revert InvalidTransaction(txId);
        if (confirmations[txId][signer]) revert SignerConfirmed(txId, signer);
        _;
    }

    modifier confirmedTransaction(uint256 txId, address signer) {
        if (!transactions[txId].created) revert InvalidTransaction(txId);
        if (!confirmations[txId][signer])
            revert SignerNotConfirmed(txId, signer);
        _;
    }

    constructor(
        address[] memory _signers,
        uint256 _required
    ) Ownable(msg.sender) {
        for (uint256 i = 0; i < _signers.length; i++) {
            if (signers[_signers[i]]) revert DuplicatedSigner(_signers[i]);
            signers[_signers[i]] = true;
        }
        required = _required;
    }

    function propose(
        address _destination,
        uint256 _value,
        bytes memory _data
    ) public onlySigner returns (uint256 txId) {
        txId = transactionId;
        transactions[txId] = Transaction({
            destination: _destination,
            value: _value,
            data: _data,
            executed: false,
            created: true,
            approvals: 0
        });
        transactionId += 1;
        emit OnTransactionProposed(txId, msg.sender);
    }

    function _externalCall(
        address destination,
        uint256 value,
        uint256 dataLength,
        bytes memory data
    ) internal returns (bool rc) {
        assembly {
            // "Allocate" memory for output (0x40 is where "free memory" pointer is stored by convention)
            let x := mload(0x40)
            // First 32 bytes are the padded length of data, so exclude that
            let d := add(data, 32)
            rc := call(
                // 34710 is the value that solidity is currently emitting
                // It includes callGas (700) + callVeryLow (3, to pay for SUB) + callValueTransferGas (9000) +
                // callNewAccountGas (25000, in case the destination address does not exist and needs creating)
                sub(gas(), 34710),
                destination,
                value,
                d,
                // Size of the input (in bytes) - this is what fixes the padding problem
                dataLength,
                x,
                // Output is ignored, therefore the output size is zero
                0
            )
        }
    }

    function execute(
        uint256 txId
    )
        public
        onlySigner
        confirmedTransaction(txId, msg.sender)
        returns (bytes memory data)
    {
        Transaction storage transaction = transactions[txId];
        if (transaction.approvals >= required) {
            transaction.executed = true;
            if (
                _externalCall(
                    transaction.destination,
                    transaction.value,
                    transaction.data.length,
                    transaction.data
                )
            ) {
                emit OnTransactionExecuted(txId);
            } else {
                emit OnTransactionFailure(txId);
                transaction.executed = false;
            }
        }
    }

    function approve(
        uint256 txId
    )
        public
        onlySigner
        validTransaction(txId, msg.sender)
        returns (bytes memory data)
    {
        confirmations[txId][msg.sender] = true;
        transactions[txId].approvals += 1;
        data = execute(txId);
        emit OnTransactionApproved(txId, msg.sender);
    }
}
