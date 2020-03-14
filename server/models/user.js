const mongoose = require('mongoose');

let userSchema = new mongoose.Schema(
        {
            email: {type: String},
            username: {type: String},
            password: {type: String},
            country: {type: String},
            role: {type: Number}
        });

module.exports = mongoose.model('user', userSchema);