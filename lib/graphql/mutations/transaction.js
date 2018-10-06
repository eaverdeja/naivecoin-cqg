const CREATE_TRANSACTION = `
mutation sendTransaction($data: TransactionData!) {
    sendTransaction(data: $data)
}`;

export { CREATE_TRANSACTION };
