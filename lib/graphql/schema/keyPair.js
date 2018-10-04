import { gql } from 'apollo-server-express'

export default gql`
  type KeyPair {
    index: Int! 
    secretKey: String!
    publicKey: String!
  }
`
