import { gql } from 'apollo-server-express';

export default gql`
    extend type Query {
        transactions: [Transaction!]!
        getTransactionById(id: ID!): Transaction!
        getTransactionsByAddress(address: String!): [Transaction!]!
        unconfirmedTransactions: [Transaction!]!
    }

    extend type Mutation {
        "Creates a new transaction for the given wallet"
        createTransaction(
            walletId: ID!
            password: String!
            fromAddress: String!
            toAddress: String!
            amount: Float!
            changeAddress: String
            fromAddress: String!
        ): Transaction!
    }

    type Transaction {
        id: ID!
        hash: String!
        type: String!
        inputs: [Input!]
        outputs: [Output!]
    }
`;
