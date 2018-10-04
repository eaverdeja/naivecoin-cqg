import CryptoUtil from '../../util/cryptoUtil';

export default {
    Query: {
        wallets: (parent, args, { operator }) => operator.getWallets(),
        wallet: (parent, { id }, { operator }) => operator.getWalletById(id),
        getBalanceForAddress: (parent, { address }, { operator }) =>
            operator.getBalanceForAddress(address),
        getAddressSummary: (parent, { address }, { blockchain }) => {
            const transactions = blockchain.getTransactionsByAddress(address);
            let totalSent = 0;
            transactions.map(transaction => {
                transaction.data.inputs.map(input => {
                    if (address === input.address) {
                        totalSent += input.amount;
                    }
                });
            });
            let totalReceived = 0;
            transactions.map(transaction => {
                transaction.data.outputs.map(output => {
                    if (address === output.address) {
                        totalReceived += output.amount;
                    }
                });
            });

            const balance = totalReceived - totalSent

            const unspentOutputs = blockchain.getUnspentTransactionsForAddress(
                address
            );

            return {
                balance,
                totalSent,
                totalReceived,
                unspentOutputs
            };
        }
    },

    Mutation: {
        createWallet: (parent, { password }, { operator }) =>
            operator.createWalletFromPassword(password),
        createAddress: (parent, { id: walletId, password }, { operator }) => {
            let passwordHash = CryptoUtil.hash(password);
            if (!operator.checkWalletPassword(walletId, passwordHash))
                throw new Error(`Invalid password for wallet '${walletId}'`);

            return operator.generateAddressForWallet(walletId);
        }
    },

    Wallet: {
        addresses: (wallet, args, { operator }) =>
            operator.getAddressesForWallet(wallet.id)
    }
};
