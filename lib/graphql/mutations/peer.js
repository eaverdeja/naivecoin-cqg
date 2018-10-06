const CONNECT_TO_PEER = `
    mutation ConnectToPeer($url: String!){
        connectToPeer(url: $url)
    },
`;

export { CONNECT_TO_PEER };
