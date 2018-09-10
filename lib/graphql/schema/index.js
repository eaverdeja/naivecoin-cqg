import { gql } from 'apollo-server-express'

import walletSchema from './wallet'
import keyPairSchema from './keyPair'

import blockSchema from './block'
import transactionSchema from './transaction'
import inputSchema from './input'
import outputSchema from './output'

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _:Boolean
  }

  type Subscription {
    _: Boolean
  }
`

export default [
  linkSchema,
  walletSchema,
  keyPairSchema,
  blockSchema,
  transactionSchema,
  inputSchema,
  outputSchema
]
