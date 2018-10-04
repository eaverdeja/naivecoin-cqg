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
    merkleRoot: String
    nonce: Int!
    previousHash: String!
    timestamp: Float!
    hash: String!
    difficulty: Float
    transactions: [Transaction!]
  }
`
