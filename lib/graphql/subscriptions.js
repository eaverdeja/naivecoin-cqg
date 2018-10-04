const ApolloServer = require('apollo-server');

const pubsub = new ApolloServer.PubSub();

const BLOCK_MINED = 'BLOCK_MINED';
const SERVER_LOG_UPDATE = 'SERVER_LOG_UPDATE';

module.exports = {
  pubsub,
  types: { BLOCK_MINED, SERVER_LOG_UPDATE } 
} 
