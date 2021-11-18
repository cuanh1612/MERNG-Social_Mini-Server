const postsResolvers = require('./posts')
const usersResolvers = require('./users')
const commentResolvers = require('./comments')

module.exports = {
    Query: {
        ...postsResolvers.Query,
        ...usersResolvers.Query,
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentResolvers.Mutation
    },
    Subscription: {
        ...postsResolvers.Subscription
    },
    Post: {
        ...postsResolvers.Post
    }
}