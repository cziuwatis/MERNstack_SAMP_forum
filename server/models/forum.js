const mongoose = require('mongoose');

let postSchema = new mongoose.Schema(
        {
            postedBy: {type: Number},
            postDate: {type: Date, default: Date.now},
            content: {type: String}
        });
let topicSchema = new mongoose.Schema(
        {
            title: {type: String},
            creationDate: {type: Date, default: Date.now},
            postedBy: {type: Number},
            posts: [postSchema]
        });

let subforumTopicSchema = new mongoose.Schema(
        {
            title: {type: String},
            description: {type: String},
            topics: [topicSchema]
        });
let subforumSchema = new mongoose.Schema(
        {
            title: {type: String},
            topics: [subforumTopicSchema]
        });

module.exports = mongoose.model('subforum', subforumSchema);