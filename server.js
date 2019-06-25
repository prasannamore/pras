/*************************************************************************  
* @Execution : default node : cmd> server.js
* 
* 
* @Purpose : Create server using apollo-graphql
* 
* @description : connect all the server mechanism(path)
* 
* @overview : fundoo application
* @author : Prasanna More <prasannamore.494@gmail.com>
* @version : 1.0
* @since : 27-april-2019
*
******************************************************************************/


// require files
//const { ApolloServer }= require('apollo-server');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const { typeDefs } = require('./src/schema');
//const upload = require('./services/awsService').upload;
const resolvers = require('./src/resolvers').resolvers
const dbConfig = require('./config/mongoDBconnection');
const mongoose = require('mongoose');
const redisConnection = require("./config/redisConnection").redisConnection
const winston = require("winston")
// redis connection
redisConnection();

// connection to mongoose
dbConfig.mongoConnect();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    // get the user token from the headers
    token: req.query.token,
    origin: req.headers.origin,
    code: req.query.code,
    request: req
  })
});

const app = express();

//app.use("*",upload.single('photos'))
server.applyMiddleware({ app });

//  start server
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)


