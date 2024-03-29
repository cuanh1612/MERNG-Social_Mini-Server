const { gql } = require('apollo-server')

const typeDefs = gql`
    type Query{
        sayHi: String!
        getPosts(offset: Int!, limit: Int!): [Post]
        getPost(postId: ID!): Post
    }

    type Post{
      id: ID!
      body: String!
      createdAt: String!
      username: String!
      comments: [Comment]!
      likes: [Like]!
      likesCount: Int!
      commentsCount: Int!
    }

    type Comment{
        id: ID!
        createdAt: String!
        username: String!
        body: String!

    }

    type Like{
        id: ID!
        createdAt: String!
        username: String!
    }

    type User{
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }

    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }

    type Mutation{
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
        createComment(postId: ID!, body: String!): Post!
        deleteComment(postId: ID!,commentId: ID!): Post!
        likePost(postId: ID!): Post!
    }

    type Subscription{
        newPost: Post!
    }
`

module.exports = typeDefs