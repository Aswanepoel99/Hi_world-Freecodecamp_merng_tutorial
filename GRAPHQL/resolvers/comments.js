const { AuthenticationError, UserInputError } = require('apollo-server')

const post = require('../../models/post');
const checkAuth = require('../../Util/check_auth')


module.exports = {
    Mutation: {
        createComment: async (__, { postId, body }, context) => {
            const { username } = checkAuth(context);
            if (body.trim === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment body must not be empty'
                    }
                })
            }
            const Post = await post.findById(postId);
            if (Post) {
                Post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await Post.save();
                return Post;
            } else throw new UserInputError("Post not found")
        },

        async deleteComment(_, { postId, commentId }, context) {
            console.log(postId, commentId)
            const { username } = checkAuth(context);
            const Post = await post.findById(postId);
            if (Post) {
                const commentIndex = Post.comments.findIndex(c => c.id === commentId);
                if (Post.comments[commentIndex].username === username) {
                    Post.comments.splice(commentIndex, 1);
                    await Post.save();
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
