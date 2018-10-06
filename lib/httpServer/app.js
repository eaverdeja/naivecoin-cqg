import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import ip from 'ip';
import schema from '../graphql/schema';
import resolvers from '../graphql/resolvers';

class GraphQLServer {
    constructor(node, blockchain, operator, miner) {
        this.node = node;
        this.blockchain = blockchain;
        this.operator = operator;
        this.miner = miner;
        this.express = express();
        this.init();
    }

    init() {
        const server = new ApolloServer({
            typeDefs: schema,
            resolvers,
            context: {
                node: this.node,
                operator: this.operator,
                blockchain: this.blockchain,
                miner: this.miner
            },
            playground: {
                settings: {
                    'editor.cursorShape': 'line'
                }
            }
        });

        server.applyMiddleware({ app: this.express, path: '/graphql' });

        const httpServer = createServer(this.express);
        server.installSubscriptionHandlers(httpServer);

        const host = process.env.NAME || ip.address();
        httpServer.listen({ host, port: 8000 }, () => {
            console.log(
                `This is Apollo Server on http://${host}:8000/graphql !!!`
            );
        });
    }
}

export default GraphQLServer;
