//imports model and schema from mongoose
const { model, Schema } = require('mongoose');

//creates schema for posts
const postSchema = new Schema({
    body: String,
    username: String,
    createdAt: String,
    comments: [
        {
            body: String,
            username: String,
            createdAt: String
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String,

        }
    ]

})
module.exports = model("post", postSchema);