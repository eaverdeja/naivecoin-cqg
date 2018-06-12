
// INFO: There are different implementations of the hash algorithm, for example: https://en.bitcoin.it/wiki/Hashcash
return CryptoUtil.hash(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce);

// INFO: In this implementation the database is a file and every time data is saved it rewrites the file, probably it should be a more robust database for performance reasons
this.blocksDb = new Db('data/' + dbName + '/' + BLOCKCHAIN_FILE, new Blocks());
this.transactionsDb = new Db('data/' + dbName + '/' + TRANSACTIONS_FILE, new Transactions());

this.blocks = this.blocksDb.read(Blocks);
this.transactions = this.transactionsDb.read(Transactions);

// INFO: Here it would need to check if the block follows some expectation regarging the minimal number of transactions, value or data size to avoid empty blocks being mined.
checkBlock( ... )

// INFO: There are different implementations of the hash algorithm, for example: https://en.bitcoin.it/wiki/Hashcash
return CryptoUtil.hash(this.id + this.type + JSON.stringify(this.data));

// INFO: The mining reward could decreases over time like bitcoin. See https://en.bitcoin.it/wiki/Mining#Reward.
MINING_REWARD: 5000000000,

// INFO: Usually it's a fee over transaction size (not quantity)
FEE_PER_TRANSACTION: 1,

// INFO: Usually the limit is determined by block size (not quantity)
TRANSACTIONS_PER_BLOCK: 2,

// INFO: The difficulty is the formula that naivecoin choose to check the proof a work, this number is later converted to base 16 to represent the minimal initial hash expected value.
// This could be a formula based on time. Eg.: Check how long it took to mine X blocks over a period of time and then decrease/increase the difficulty based on that. See https://en.bitcoin.it/wiki/Difficulty
    return Math.max(
        Math.floor(
            BASE_DIFFICULTY / Math.pow(
                Math.floor(((index || blocks.length) + 1) / EVERY_X_BLOCKS) + 1
                , POW_CURVE)
        )
        , 0);

// INFO: Usually here is a locking script (to check who and when this transaction output can be used), in this case it's a simple destination address 
let feeTransaction = Transaction.fromJson({
        id: CryptoUtil.randomId(64),
        hash: null,
        type: 'fee',
        data: {
            inputs: [],
            outputs: [
                {
                    amount: Config.FEE_PER_TRANSACTION * transactions.length, // satoshis format
                    address: feeAddress,
                }
            ]
        }
    });

    transactions.push(feeTransaction);

// INFO: Usually here is a locking script (to check who and when this transaction output can be used), in this case it's a simple destination address 
// Add reward transaction of 50 coins
if (rewardAddress != null) {
    let rewardTransaction = Transaction.fromJson({
        id: CryptoUtil.randomId(64),
        hash: null,
        type: 'reward',
        data: {
            inputs: [],
            outputs: [
                {
                    amount: Config.MINING_REWARD, // satoshis format
                    address: rewardAddress,
                }
            ]
        }
    });

    transactions.push(rewardTransaction);
}

// INFO: Every cryptocurrency has a different way to prove work, this is a simple hash sequence
// Loop incrementing the nonce to find the hash at desired difficulty
do {
    block.timestamp = new Date().getTime() / 1000;
    block.nonce++;
    block.hash = block.toHash();
    blockDifficulty = block.getDifficulty();
} while (blockDifficulty >= difficulty);
console.info(`Block found: time '${process.hrtime(start)[0]} sec' dif '${difficulty}' hash '${block.hash}' nonce '${block.nonce}'`);
return block;
