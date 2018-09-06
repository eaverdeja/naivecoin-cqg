import CryptoUtil from '../../util/cryptoUtil';

export default {
  Query: {
    wallets: (parent, args, { operator }) => operator.getWallets(),
    wallet: (parent, { id }, { operator }) => operator.getWalletById(id),
  },

  Mutation: {
    createWallet: (parent, { password }, { operator }) =>
      operator.createWalletFromPassword(password),
    createAddress: (parent, { walletId, password }, { operator }) => {
      if (password == null) throw new Error('Wallet\'s password is missing.');
      let passwordHash = CryptoUtil.hash(password);

      return operator.generateAddressForWallet(walletId);
    }
  },

  Wallet: {
    addresses: (wallet, args, { operator }) =>
      operator.getAddressesForWallet(wallet.id)
  }
}
