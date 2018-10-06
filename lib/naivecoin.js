const HttpServer = require('./httpServer');
const Blockchain = require('./blockchain');
const Operator = require('./operator');
const Miner = require('./miner');
const Node = require('./node');

import GraphQLServer from './httpServer/app';

module.exports = function naivecoin(host, port, peers, logLevel, name) {
    host = process.env.NAME || process.env.HOST || host || 'localhost';
    port = process.env.PORT || process.env.HTTP_PORT || port || 8000;
    peers = process.env.PEERS ? process.env.PEERS.split(',') : peers || [];
    peers = peers.map(peer => {
        return { url: peer };
    });
    logLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : logLevel || 6;
    name = process.env.NAME || name || 'node1';

    require('./util/consoleWrapper.js')(name, logLevel);
    console.info(`Starting ${name}`);

    let blockchain = new Blockchain(name);
    let operator = new Operator(name, blockchain);
    let miner = new Miner(blockchain, logLevel, port);
    let node = new Node(host, port, peers, blockchain);
    let graphQLServer = new GraphQLServer(node, blockchain, operator, miner);
    let httpServer = new HttpServer(node, blockchain, operator, miner);
};
