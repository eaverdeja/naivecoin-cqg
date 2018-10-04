import subscriptions from '../subscriptions';
import Block from '../../blockchain/block';
import Transaction from '../../blockchain/transaction';
import R from 'ramda'

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
            node.peers.map(peer => peer.url)
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
          const block = Block.fromJson(data)
          let result = node.checkReceivedBlock(block);

          if (result === null) return 'Querying our peers for the blockchain.';

          if (result) return 'Latest block was updated!';
          else return 'Blockchain was already up to date';
        }
    }
};
