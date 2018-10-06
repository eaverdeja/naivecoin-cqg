import subscriptions from '../subscriptions';
import Block from '../../blockchain/block';
import Transaction from '../../blockchain/transaction';
import fs from 'fs';

const dataFolder = process.env.NAME || 'node1';

export default {
    Subscription: {
        serverLogUpdate: {
            subscribe: () =>
                subscriptions.pubsub.asyncIterator([
                    subscriptions.types.SERVER_LOG_UPDATE
                ])
        }
    },
    Query: {
        connectedPeers: (parent, args, { node }) =>
            node.peers.map(peer => peer.url),
        serverLog: (parent, args, { node }) =>
            fs.readFileSync(`data/${dataFolder}/combined.log`, {
                encoding: 'utf-8',
                flag: 'r'
            })
    },
    Mutation: {
        connectToPeer: (parent, { url }, { node }) => {
            const result = node.connectToPeer({ url });
            if (result.success) {
                return url;
            } else {
                return result.message;
            }
        },
        sendLatestBlock: (parent, { data }, { blockchain, node }) => {
            const block = Block.fromJson(data);
            let result = node.checkReceivedBlock(block);

            if (result === null)
                return 'Querying our peers for the blockchain.';

            if (result) return 'Latest block was updated!';
            else return 'Blockchain was already up to date';
        },
        sendTransaction: (parent, { data }, { blockchain }) => {
            let requestTransaction = Transaction.fromJson(data);
            let transactionFound = blockchain.getTransactionById(
                requestTransaction.id
            );

            if (transactionFound != null)
                return `Transaction '${requestTransaction.id}' already exists`;

            try {
                let newTransaction = blockchain.addTransaction(
                    requestTransaction
                );
                return `Transaction '${requestTransaction.id}' added to pool`;
            } catch (ex) {
                if (ex instanceof TransactionAssertionError) return ex.message;
                else throw ex;
            }
        }
    }
};
