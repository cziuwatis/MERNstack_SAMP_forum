const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

let postSchema = new mongoose.Schema(
        {
            postedBy: {type: mongoose.Schema.Types.ObjectId, ref:'user'},
            postDate: {type: Date, default: Date.now},
            content: {type: String}
        });
let topicSchema = new mongoose.Schema(
        {
            title: {type: String},
            creationDate: {type: Date, default: Date.now},
            postedBy: {type: mongoose.Schema.Types.ObjectId, ref:'user'},
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
            index: {type: Number},
            topics: [subforumTopicSchema]
        });

subforumSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('subforum', subforumSchema);