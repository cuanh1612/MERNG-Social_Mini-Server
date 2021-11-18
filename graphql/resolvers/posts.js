const { AuthenticationError, UserInputError } = require('apollo-server-errors')
const post = require('../../models/post')
const checkAuth = require('../../util/checkAuth')
const {PubSub} = require('graphql-subscriptions')

const PU = new PubSub()

const postResolvers = {
    Query: {
        sayHi: () => 'Hello World!',

        getPosts: async () => {
            try {
                const Posts = await post.find().sort({createdAt: -1})
                return Posts
            } catch (error) {
                throw new Error(error)
            }
        },

        getPost: async (_, { postId }) => {
            try {
                const Post = post.findById(postId)
                if (post) {
                    return Post
                } else {
                    throw new Error('Post not found')
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    },

    Post: {
        likesCount: async (parent) => {
            return parent.likes.length
        },
        commentsCount: async (parent) => {
            return parent.comments.length
        }
    },


    Mutation: {
        createPost: async (_, { body }, context) => {
            const user = checkAuth(context)

            if(body.trim() === ''){
                throw new Error('Post body must not be empty')
            }

            const newPost = new post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })

            const Post = await newPost.save()

            console.log(context.pubsub);

            PU.publish('NEW_POST', {
                newPost: Post
            })

            return Post
        },

        deletePost: async (_, {postId}, context) => {
            const user = checkAuth(context)

            try {
                const Post = await post.findById(postId)
                if(user.username === Post.username){
                    await Post.delete()
                    return 'Post deleted successfully'
                }else {
                    throw new AuthenticationError('Action not allowed')
                }
            } catch (error) {
                throw new Error(error)
            }
        },

        likePost: async (_, {postId}, context) => {
            const {username} = checkAuth(context)

            const Post = await post.findById(postId)
            if(Post){
                if(Post.likes.find(like => like.username == username)){
                    Post.likes = Post.likes.filter(like => like.username !== username)
                }else {
                    Post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }

                await Post.save()
                return Post
            } else throw new UserInputError()
        }
    }, 

    Subscription: {
        newPost: {
            subscribe: (_, __, {pubsub}) => PU.asyncIterator(['NEW_POST'])
        }
    }
}

module.exports = postResolvers