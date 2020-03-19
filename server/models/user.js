const mongoose = require('mongoose');
let postSchema = new mongoose.Schema(
        {
            postedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
            postDate: {type: Date, default: Date.now},
            content: {type: String}
        });
let userSchema = new mongoose.Schema(
        {
            //_id: mongoose.Schema.Types.ObjectId,
            email: {type: String, required: true, unique: true},
            username: {type: String, unique: true, required: true, minlength: 3, maxlength: 20,  collation: {locale: 'simple', strength: 1}},
            password: {type: String, required: true, minlength: 10},
            salt: {type: String, required: true},
            country: {type: String, default: "Ireland", maxlength: 30},
            postCount: {type: Number, default: 0},
            role: {type: Number, default: 1},
                        posts: [postSchema]
        });

module.exports = mongoose.model('user', userSchema);