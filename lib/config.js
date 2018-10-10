// Do not change these configurations after the blockchain is initialized
module.exports = {
    // INFO: The mining reward could decreases over time like bitcoin. See https://en.bitcoin.it/wiki/Mining#Reward.
    MINING_REWARD: 5000000000,
    // INFO: Usually it's a fee over transaction size (not quantity)
    FEE_PER_TRANSACTION: 1,
    // INFO: Usually the limit is determined by block size (not quantity)
    TRANSACTIONS_PER_BLOCK: 100,
    genesisBlock: {
        index: '0',
        hash:
            'c4e0b8df46ce5cb2bcb0379ab0840228536cf4cd489783532a7c9d199754d1ed',
        previousHash: '0',
        merkleRoot: null,
        timestamp: 1465154705,
        nonce: 0,
        difficulty: null,
        transactions: [
            {
                id:
                    '63ec3ac02f822450039df13ddf7c3c0f19bab4acd4dc928c62fcd78d5ebc6dba',
                hash:
                    '86b601510fd25a372f65409279b3f58d14cd5ea0d6a308dc53fff19beae43029',
                type: 'regular',
                inputs: [],
                outputs: []
            }
        ]
    },
    pow: {
        getDifficulty: (blocks, index) => {
            // Proof-of-work difficulty settings
            const BASE_DIFFICULTY = Number.MAX_SAFE_INTEGER;
            const EVERY_X_BLOCKS = 5;
            const POW_CURVE = 5;

            // INFO: The difficulty is the formula that naivecoin choose to check the proof a work, this number is later converted to base 16 to represent the minimal initial hash expected value.
            // INFO: This could be a formula based on time. Eg.: Check how long it took to mine X blocks over a period of time and then decrease/increase the difficulty based on that. See https://en.bitcoin.it/wiki/Difficulty
            return Math.max(
                Math.floor(
                    BASE_DIFFICULTY /
                        Math.pow(Math.floor(30 / EVERY_X_BLOCKS) + 1, POW_CURVE)
                ),
                0
            );
        }
    }
};
