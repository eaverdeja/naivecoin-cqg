import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    transactions: [Transaction!]!
    getTransactionById(id: ID!): Transaction!
  }

  type Transaction {
    id: ID!
    hash: String!
    type: String!
    inputs: [Input!]
    outputs: [Output!]
  }
`
