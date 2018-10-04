import CryptoUtil from '../../util/cryptoUtil';
import Transaction from '../../blockchain/transaction';

export default {
    Query: {
        getTransactionById: (parent, { id: transactionId }, { blockchain }) => {
            let block = blockchain.getTransactionFromBlocks(transactionId);
            if (block == null)
                throw new Error(
                    `Transaction '${transactionId}' not found in any block`
                );

            return block.transactions.filter(tx => tx.id === transactionId)[0];
        },
        getTransactionsByAddress: (parent, { address }, { blockchain }) => {
            let transactionsFromAddress = blockchain.getTransactionsByAddress(
                address
            );
            if (transactionsFromAddress == null)
                throw new Error(`No transactions found for address ${address}`);

            return transactionsFromAddress;
        },
        unconfirmedTransactions: (parent, args, { blockchain }) =>
            blockchain.getAllTransactions()
    },

    Mutation: {
        createTransaction: (
            parent,
            {
                walletId,
                password,
                fromAddress,
                toAddress,
                amount,
                changeAddress
            },
            { blockchain, operator }
        ) => {
            let passwordHash = CryptoUtil.hash(password);

            if (!operator.checkWalletPassword(walletId, passwordHash))
                throw new Error(`Invalid password for wallet '${walletId}'`);

            let newTransaction = operator.createTransaction(
                walletId,
                fromAddress,
                toAddress,
                amount,
                changeAddress || fromAddress
            );

            newTransaction.check();

            let transactionCreated = blockchain.addTransaction(
                Transaction.fromJson(newTransaction)
            );

            return transactionCreated;
        }
    },

    Transaction: {
        inputs: transaction => transaction.data.inputs,
        outputs: transaction => transaction.data.outputs
    }
};
