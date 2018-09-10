export default {
  Query: {
    blocks: (parent, args, { blockchain }) => blockchain.getAllBlocks(),
    lastBlock: (parent, args, { blockchain }) => {
      let lastBlock = blockchain.getLastBlock();
      if (lastBlock == null) throw new Error('Last block not found');

      return lastBlock
    },
    getBlockByHash(parent, { hash }, { blockchain }) {
      let blockFound = blockchain.getBlockByHash(hash);
      if (blockFound == null) throw new Error(`Block not found with hash '${hash}'`);

      return blockFound
    },
    getBlockByIndex(parent, { index }, { blockchain }) {
      let blockFound = blockchain.getBlockByIndex(parseInt(index));
      if (blockFound == null) throw new Error(`Block not found with index '${index}'`);

      return blockFound
    }
  }
}
