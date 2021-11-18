const mongoose = require('mongoose')
const { urlMongo } = require('./config')
const typeDefs = require("./graphql/typeDefs")
const resolvers = require("./graphql/resolvers")

const { createServer } = require('http')
const { execute, subscribe } = require("graphql")
const { SubscriptionServer } = require("subscriptions-transport-ws")
const { ApolloServer } = require("apollo-server-express")
const express = require("express")
const { makeExecutableSchema } = require("@graphql-tools/schema")



const uri = "mongodb+srv://admin:huy16120101@cluster0.rwzsn.mongodb.net/MERNG_SOCIAL_MINI?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(res => {
  console.log('connect db success');
}).catch(err => { console.log('connect failed') })




const r = async () => {
const app = express()
const httpServer = createServer(app)

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})



const server = new ApolloServer({
  schema,
  plugins: [{
    async serverWillStart() {
      return {
        async drainServer() {
          subscriptionServer.close();
        }
      };
    }
  }],
  context: ({req})=> ({req})
});

const subscriptionServer = SubscriptionServer.create(
  { schema, execute, subscribe },
  { server: httpServer, path: server.graphqlPath }
);

await server.start();
server.applyMiddleware({ app });

const PORT = process.env.port || 5000;
httpServer.listen(PORT, () =>
  console.log(`Server is now running on http://localhost:${PORT}/graphql`)
);
}

r()
