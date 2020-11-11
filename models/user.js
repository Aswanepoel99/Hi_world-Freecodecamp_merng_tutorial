//imports model and schema from mongoose
const { model, Schema } = require('mongoose');

//creates schema for user (required fields will be done on graph ql)
const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String,

})
//exports user model
module.exports = model('User', userSchema);