import { gql } from 'apollo-server-express'

import walletSchema from './wallet'
import keyPairSchema from './keyPair'

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

export default [linkSchema, walletSchema, keyPairSchema]
