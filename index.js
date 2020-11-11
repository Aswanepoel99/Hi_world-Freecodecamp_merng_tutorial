//imports required packages
const { ApolloServer } = require('apollo-server');
//const gql = require('graphql-tag');
const mongoose = require('mongoose');

//import config info
const { MONGODB } = require('./config.js');

//import models, typedefs,resolvers
const post = require('./models/post')
const User = require('./models/user')
const typeDefs = require('./GRAPHQL/typeDefs');
const resolvers = require('./GRAPHQL/resolvers')

//creates apollo server object
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
});

//connects to database
mongoose.set('useNewUrlParser', true);
mongoose.connect(MONGODB, { useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected');
        return server.listen({ port: 9001 });
    })
    .then(res => {
        console.log(`server running at ${res.url} `)
    })