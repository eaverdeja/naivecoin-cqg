const GET_BLOCKS = `
query {
    blocks {
        index
        hash
        previousHash
        merkleRoot
        timestamp
        nonce
        difficulty
        transactions {
            id
            hash
            type
            inputs {
                transaction
                address
                amount
                signature
            }
            outputs {
                address
                amount
            }
        }
    }
}`;

const LAST_BLOCK = `
query {
    lastBlock {
        index
        hash
        previousHash
        merkleRoot
        timestamp
        nonce
        difficulty
        transactions {
            id
            hash
            type
            inputs {
                transaction
                index
                address
                amount
                signature
            }
            outputs {
                address
                amount
            }
        }
    }
}
`;

export { GET_BLOCKS, LAST_BLOCK };
