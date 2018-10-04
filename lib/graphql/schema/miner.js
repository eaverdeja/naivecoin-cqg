import { gql } from "apollo-server-express"

export default gql`
    extend type Mutation {
        mine(rewardAddress: String!, feeAddress: String): Block!
    }

    extend type Subscription {
        blockMined: Block
    }
`
