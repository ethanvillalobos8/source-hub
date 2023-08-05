const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    name: String,
    url: String
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    links: [linkSchema]
}, { collection: 'users' });

module.exports = mongoose.model('users', userSchema);