import { gql } from 'apollo-server-express';

export default gql`
    #The input types declared below are necessary
    #for nodes to transmit block and transaction data
    #to one another

    input InputData {
        transaction: String!
        index: Int!
        amount: Float!
        address: String!
        signature: String!
    }

    input OutputData {
        amount: Float!
        address: String!
    }

    input TxData {
        inputs: [InputData!]
        outputs: [OutputData!]
    }

    input TransactionData {
        id: ID!
        hash: String!
        type: String!
        data: TxData!
    }

    input BlockData {
        index: ID!
        merkleRoot: String
        nonce: Int!
        previousHash: String!
        timestamp: Float!
        hash: String!
        difficulty: Float
        transactions: [TransactionData!]
    }

    extend type Mutation {
        connectToPeer(url: String!): String!
        sendLatestBlock(data: BlockData!, peer: String!): String!
        sendTransaction(data: TransactionData!): String!
    }

    extend type Query {
        connectedPeers: [String!]!
        serverLog: String!
    }

    extend type Subscription {
        serverLogUpdate: String!
    }
`;
