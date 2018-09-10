import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import schema from '../graphql/schema';
import resolvers from '../graphql/resolvers';

class GraphQLServer {
    constructor(blockchain, operator) {
        this.blockchain = blockchain;
        this.operator = operator;
        this.express = express();
        this.init();
    }

    init() {
        const server = new ApolloServer({
            typeDefs: schema,
            resolvers,
            context: {
                operator: this.operator,
                blockchain: this.blockchain
            },
            playground: {
                settings: {
                    'editor.cursorShape': 'line'
                }
            }
        });

        server.applyMiddleware({ app: this.express, path: '/graphql' });

        this.express.listen({ port: 8000 }, () => {
            console.log(
                'This is Apollo Server on http://localhost:8000/graphql !!!'
            );
        });
    }
}

export default GraphQLServer;
