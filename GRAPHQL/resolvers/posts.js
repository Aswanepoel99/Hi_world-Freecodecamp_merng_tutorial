const { AuthenticationError } = require("apollo-server");
const post = require("../../models/post")
const checkAuth = require('../../Util/check_auth');

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await post.find().sort({ createdAt: -1 });
                return posts;
            } catch (err) {
                throw new Error(er);
            }
        },
        //fetches specific posts
        //TODO: fix capitalization on post variables
        async getPost(_, { postId }) {
            try {
                const PostGet = await post.findById(postId);
                if (PostGet) {
                    return PostGet;
                } else {
                    throw new Error('Post not founbd')
                }
            } catch (err) {
                throw new Error(err);
            }

        }
    },
    Mutation: {
        async createPost(_, { body }, context) {
            const user = checkAuth(context);
            console.log(user);

            const newPost = new post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            const Post = await newPost.save();
            return Post
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);

            try {
                const postToDel = await post.findById(postId);
                if (user.username === postToDel.username) {
                    await postToDel.delete();
                    return 'post deleted successfully'
                } else {
                    throw new AuthenticationError('action not allowed');
                }
            } catch (err) {
                throw new Error(err);
            }
        }

    }
}