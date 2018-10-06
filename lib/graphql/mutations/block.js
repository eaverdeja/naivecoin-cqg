const SEND_LATEST_BLOCK = `
mutation sendLatestBlock($data: BlockData!) {
    sendLatestBlock(data: $data)
}`;

export { SEND_LATEST_BLOCK };
