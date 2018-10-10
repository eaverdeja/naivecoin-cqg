const SEND_LATEST_BLOCK = `
mutation sendLatestBlock($data: BlockData!, $peer: String!) {
    sendLatestBlock(data: $data, peer: $peer)
}`;

export { SEND_LATEST_BLOCK };
