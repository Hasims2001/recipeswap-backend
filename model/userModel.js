
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    followers: [String],
    following: [String],
    token: String,
    review: [Object],
})

const UserModel = mongoose.model("user", userSchema);

module.exports = {
    UserModel
}




