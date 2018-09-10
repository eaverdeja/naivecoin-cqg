export default {
  Query: {
    getTransactionById: (parent, { id: transactionId }, { blockchain }) => {
      let transactionFromBlock = blockchain.getTransactionFromBlocks(transactionId);
      if (transactionFromBlock == null) throw new Error(`Transaction '${transactionId}' not found in any block`);

      return transactionFromBlock.transactions[0];
    }
  },

  Transaction: {
    inputs: transaction => transaction.data.inputs,
    outputs: transaction => transaction.data.outputs,
  }
}
