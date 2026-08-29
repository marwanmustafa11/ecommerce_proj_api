const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String
}, {
    collection: 'User'
});

const User = mongoose.model('User', userSchema);

module.exports = User;