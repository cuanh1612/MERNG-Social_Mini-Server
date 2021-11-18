const { UserInputError, AuthenticationError } = require('apollo-server-errors')
const post = require('../../models/post')
const checkAuth = require('../../util/checkAuth')

const commentResolvers = {
    Mutation: {
        createComment: async (_, { postId, body }, context) => {
            const { username } = checkAuth(context)

            if (body.trim() === "") {
                throw new UserInputError("Empty comment", {
                    errors: {
                        body: "Comment body must not empty"
                    }
                })
            }

            const Post = await post.findById(postId)

            if (Post) {
                Post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })

                await Post.save()
                return Post

            } else throw new UserInputError('Post not found')
        },

        deleteComment: async (_, { postId, commentId }, context) => {
            const { username } = checkAuth(context)

            const Post = await post.findById(postId)

            if (Post) {
                const commentIndex = Post.comments.findIndex(c => c.id === commentId)

                if (Post.comments.splice(commentIndex, 1)) {
                    await Post.save()
                    return Post
                } else {
                    throw new AuthenticationError('Action not allowed')
                }

            } else {
                throw new UserInputError('Post not found')
            }
        }
    }
}

module.exports = commentResolvers