const UNCONFIRMED_TRANSACTIONS = `
query {
    unconfirmedTransactions {
        id
        hash
        type
        inputs {
            transaction
            address
            amount
            signature
        }
        outputs {
            address
            amount
        }
    }
}
`;

export { UNCONFIRMED_TRANSACTIONS };
