import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    blocks: [Block!]!
    lastBlock: Block!
    getBlockByHash(hash: String!): Block!
    getBlockByIndex(index: Int!): Block!
  }

  type Block {
    index: ID!
    nonce: Int!
    previousHash: String!
    timestamp: Float!
    transactions: [Transaction!]
    hash: String!
  }
`
