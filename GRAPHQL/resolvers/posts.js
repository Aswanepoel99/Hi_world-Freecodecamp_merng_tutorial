const { AuthenticationError, UserInputError } = require("apollo-server");
const { argsToArgsConfig } = require("graphql/type/definition");
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
            
            if (argsToArgsConfig.body.trim() === ''){
                throw new Error('post must not be empty');
            }
            
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
        },
        async likePost(_, { postId }, context) {
            const { username } = checkAuth(context);
            const Post = await post.findById(postId)
            if (Post) {
                if (Post.likes.find(like => like.username === username)) {
                    //returns true if post already liked
                    Post.likes = Post.likes.filter(like => like.username !== username)
                } else {
                    //not already liked, add like
                    Post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                        
                    })
                    await Post.save()
                }
                await Post.save()
                return Post
            } else throw new UserInputError('post not found')

        }
    }
}