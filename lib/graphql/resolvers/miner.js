import Block from '../../blockchain/block';
import subscriptions from '../subscriptions';

export default {
    Subscription: {
        blockMined: {
            subscribe: () =>
                subscriptions.pubsub.asyncIterator([
                    subscriptions.types.BLOCK_MINED
                ])
        }
    },
    Mutation: {
        mine: (
            parent,
            { rewardAddress, feeAddress },
            { miner, blockchain }
        ) => {
            return miner
                .mine(rewardAddress, feeAddress || rewardAddress)
                .then(newBlock => {
                    newBlock = Block.fromJson(newBlock);
                    blockchain.addBlock(newBlock);
                    subscriptions.pubsub.publish(
                        subscriptions.types.BLOCK_MINED,
                        {
                            blockMined: newBlock
                        }
                    );
                    return newBlock;
                })
                .catch(ex => {
                    if (ex.message.includes('Invalid index'))
                        throw new Error(
                            'A new block was added before we were able to mine one'
                        );
                });
        }
    }
};
