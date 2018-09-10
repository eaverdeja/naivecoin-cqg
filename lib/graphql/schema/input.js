import { gql } from 'apollo-server-express'

export default gql`
  type Input {
    transaction: String!
    index: Int!
    amount: Float!
    address: String!
    signature: String!
  }
`
