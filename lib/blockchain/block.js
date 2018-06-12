const R = require('ramda');
const CryptoUtil = require('../util/cryptoUtil');
const Transactions = require('./transactions');
const Config = require('../config');

/*
{ // Block
    "index": 0, // (first block: 0)
    "previousHash": "0", // (hash of previous block, first block is 0) (64 bytes)
    "timestamp": 1465154705, // number of seconds since January 1, 1970
    "nonce": 0, // nonce used to identify the proof-of-work step.
    "merkleRoot": "0" // Merkle root calculated from the transactions and used in the proof-of-work step.
    "transactions": [ // list of transactions inside the block
        { // transaction 0
            "id": "63ec3ac02f...8d5ebc6dba", // random id (64 bytes)
            "hash": "563b8aa350...3eecfbd26b", // hash taken from the contents of the transaction: sha256 (id + data) (64 bytes)
            "type": "regular", // transaction type (regular, fee, reward)
            "data": {
                "inputs": [], // list of input transactions
                "outputs": [] // list of output transactions
            }
        }
    ],
    "hash": "c4e0b8df46...199754d1ed" // hash taken from the contents of the block: sha256 (index + previousHash + timestamp + nonce + transactions) (64 bytes)
}
*/

class Block {
    oldToHash() {
        return CryptoUtil.hash(this.index + this.previousHash + this.timestamp + this.merkleRoot + this.nonce);
    }

    toHashByteLength() {
        let str = this.index + this.previousHash + this.timestamp + this.merkleRoot + this.nonce;
        console.assert(`Trying to hash with a merkle root, using ${Buffer.byteLength(str, 'utf8')} bytes`)
    }
    
    toHash() {
        // INFO: There are different implementations of the hash algorithm, for example: https://en.bitcoin.it/wiki/Hashcash
        return CryptoUtil.hash(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce);
    }

    oldToHashByteLength() {
        let str = this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce;
        console.assert(`Trying to hash without a merkle root, using ${Buffer.byteLength(str, 'utf8')} bytes`)
    }

    getDifficulty() {
        // 14 is the maximum precision length supported by javascript
        return parseInt(this.hash.substring(0, 14), 16);
    }

    static get genesis() {
        // The genesis block is fixed
        return Block.fromJson(Config.genesisBlock);
    }

    static fromJson(data) {
        let block = new Block();
        R.forEachObjIndexed((value, key) => {
            if (key == 'transactions' && value) {
                block[key] = Transactions.fromJson(value);
            } else {
                block[key] = value;
            }
        }, data);
        block.hash = block.toHash();
        return block;
    }

    //Merkle root implementation taken from
    //https://www.youtube.com/watch?v=1pasjSinXDs - Bitcoin Internals: How Blocks use Merkle Trees in JavaScript
    static generateMerkleRoot(txHashes, txLength) {
        let tree = Block.toPairs(txHashes)
            .reduce((tree, pair) => [...tree, Block.hashPair(...pair)], [])

        if(txHashes.length === 1 && txLength !== 1) {
            // base case - txHashes list is already reduced by the recursive algorithm
            return txHashes[0];
        } else {
            console.assert(`merkle tree: ${JSON.stringify(tree, null, 3)}`)
            return Block.generateMerkleRoot(tree);
        }
    }

    static hashPair(a, b = a) {
        return CryptoUtil.hash(`${a}${b}`);
    }

    static toPairs(arr)  {
        return Array.from(
            Array(Math.ceil(arr.length / 2)),
            (_, i) => arr.slice(i * 2, i * 2 + 2)
        )
    }
}

module.exports = Block;
