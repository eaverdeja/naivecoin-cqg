import { gql } from 'apollo-server-express'

export default gql`
  type Output {
    amount: Float!
    address: String!
  }
`
