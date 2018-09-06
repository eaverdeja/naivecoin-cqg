import CryptoUtil from '../../util/cryptoUtil';

export default {
  Query: {
    wallets: (parent, args, { operator }) => operator.getWallets(),
    wallet: (parent, { id }, { operator }) => operator.getWalletById(id),
  },

  Mutation: {
    createWallet: (parent, { password }, { operator }) =>
      operator.createWalletFromPassword(password),
    createAddress: (parent, { id: walletId, password }, { operator }) => {
      let passwordHash = CryptoUtil.hash(password);
      if (!operator.checkWalletPassword(walletId, passwordHash)) throw new Error(`Invalid password for wallet '${walletId}'`);

      return operator.generateAddressForWallet(walletId);
    }
  },

  Wallet: {
    addresses: (wallet, args, { operator }) =>
      operator.getAddressesForWallet(wallet.id)
  }
}
