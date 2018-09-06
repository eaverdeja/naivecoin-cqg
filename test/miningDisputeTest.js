require('mocha-steps');
const supertest = require('supertest');
const assert = require('assert');
const HttpServer = require('../lib/httpServer');
const Blockchain = require('../lib/blockchain');
const Operator = require('../lib/operator');
const Miner = require('../lib/miner');
const Node = require('../lib/node');
const fs = require('fs-extra');

const logLevel = 3;

require('../lib/util/consoleWrapper.js')('integrationTest', logLevel);

describe('Mining Dispute Test', () => {
    const name1 = 'integrationTest1';
    const name2 = 'integrationTest2';

    const createNaivecoin = (name, host, port, peers, removeData = true) => {
        if (removeData) fs.removeSync('data/' + name + '/');
        let blockchain = new Blockchain(name);
        let operator = new Operator(name, blockchain);
        let miner = new Miner(blockchain, logLevel, port);
        let node = new Node(host, port, peers, blockchain);
        let httpServer = new HttpServer(node, blockchain, operator, miner);
        return httpServer.listen(host, port);
    };
    
    const p2pTransactions = 1;

    const p2pTransaction = (context1, amount) => {
        return Promise.resolve()
            .then(() => {
                return supertest(context.httpServer1.app)
                    .post(`/operator/wallets/${context.walletId}/transactions`)
                    .set({ password: walletPassword })
                    .send({
                        fromAddress: context.address1,
                        toAddress: context.address2,
                        amount,
                        changeAddress: context.address1
                    })
                    .expect(201);
            })
            .then((res) => {
                context.transactionId = res.body.id;
            });
    };

    const walletPassword = 't t t t t';
    let context = {};

    step('start server 1', () => {
        return createNaivecoin(name1, 'localhost', 3001, [])
            .then((httpServer) => {
                context.httpServer1 = httpServer;
            });
    });

    step('create wallet', () => {
        return Promise.resolve()
            .then(() => {
                return supertest(context.httpServer1.app)
                    .post('/operator/wallets')
                    .send({ password: walletPassword })
                    .expect(201);
            }).then((res) => {
                context.walletId = res.body.id;
            });
    });

    step('create address 1', () => {
        return Promise.resolve()
            .then(() => {
                return supertest(context.httpServer1.app)
                    .post(`/operator/wallets/${context.walletId}/addresses`)
                    .set({ password: walletPassword })
                    .expect(201);
            }).then((res) => {
                context.address1 = res.body.address;
            });
    });

    step('mine an empty block', () => {
        return Promise.resolve()
            .then(() => {
                return supertest(context.httpServer1.app)
                    .post('/miner/mine')
                    .send({ rewardAddress: context.address1 })
                    .expect(201);
            });
    });

    step('start server 2', () => {
        return createNaivecoin(name2, 'localhost', 3002, [{ url: 'http://localhost:3001' }])
            .then((httpServer) => {
                context.httpServer2 = httpServer;
            });
    });

    step('wait for nodes synchronization', () => {
        return Promise.resolve()
            .then(() => {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve();
                    }, 1000); // Wait 1s then resolve.
                });
            });
    });

    step('check blockchain size in server 2', () => {
        return Promise.resolve()
            .then(() => {
                return supertest(context.httpServer2.app)
                    .get('/blockchain/blocks')
                    .expect(200)
                    .expect((res) => {
                        assert.equal(res.body.length, 2, 'Expected blockchain size of 3 on server 2');
                    });
            });
    });

    step('create wallet', () => {
        return Promise.resolve()
            .then(() => {
                return supertest(context.httpServer2.app)
                    .post('/operator/wallets')
                    .send({ password: walletPassword })
                    .expect(201);
            }).then((res) => {
                context.wallet2Id = res.body.id;
            });
    });

    step('create address 3', () => {
        return Promise.resolve()
            .then(() => {
                return supertest(context.httpServer2.app)
                    .post(`/operator/wallets/${context.wallet2Id}/addresses`)
                    .set({ password: walletPassword })
                    .expect(201);
            }).then((res) => {
                context.address2 = res.body.address;
            })
    });

    step(`create p2p transactions from server1 to server2 (${p2pTransactions} transactions)`, () => {
        for(let i = 0; i < p2pTransactions; i++) {
            p2pTransaction(context, 1000000000 / p2pTransactions)
        }
    });

    step('simulate a mining dispute between two nodes', () => {
        let miner1 = Promise.resolve()
            .then(() => {
                return supertest(context.httpServer1.app)
                .post('/miner/mine')
                .send({ rewardAddress: context.address1 })
                .expect(201);
            });

        let miner2 = Promise.resolve()
            .then(() => {
                return supertest(context.httpServer2.app)
                .post('/miner/mine')
                .send({ rewardAddress: context.address2 })
                .expect(201);
            });
        
        return Promise.all([miner1, miner2])
            .then(() => console.assert('waited succesfully for both miners'))
            .catch(ex => console.error(ex))
    });

    step('get latest block from node1', () => {
        return Promise.resolve()
            .then(() => {
                return supertest(context.httpServer1.app)
                    .get('/blockchain/blocks/latest')
                    .expect(200);
            })
            .then((res) => {
                context.latestBlock1 = {
                    hash: res.body.hash,
                    index: res.body.index
                };
                console.assert(JSON.stringify(context.latestBlock1, null, 3))
            });
    });

    step('get latest block from node2', () => {
        return Promise.resolve()
            .then(() => {
                return supertest(context.httpServer2.app)
                    .get('/blockchain/blocks/latest')
                    .expect(200);
            })
            .then((res) => {
                context.latestBlock2 = {
                    hash: res.body.hash,
                    index: res.body.index
                };
                console.assert(JSON.stringify(context.latestBlock2, null, 3))
            });
    });
});
