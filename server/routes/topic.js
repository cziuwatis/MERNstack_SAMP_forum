let mongoose = require('mongoose');
let express = require('express');
let router = express.Router();
const perPageLimit = 7;
mongoose.set('useFindAndModify', false);

let subforumsSchema = require(`../models/forum`);
let countersSchema = require(`../models/counter`);

router.route('/:sub_id/:subt_id/:topic_id').get((req, res) =>
        {
            subforumsSchema.findOne(
                    {
                        _id: req.params.sub_id,
                        'topics._id': req.params.subt_id
                    },
                    '$topics.title topics.$.topics',
                    (error, data) =>
            {
                if (error)
                {
                    res.json({error: error});
                } else
                {
                    let topic = "";
                    for (let i = 0; i < data.topics[0].topics.length; i++) {
                        if (data.topics[0].topics[i]._id == req.params.topic_id) {
                            topic = data.topics[0].topics[i];
                            break;
                        }
                    }
                    res.json({topic: topic, subforum: {title: data.topics[0].title}});
                }
            });
        });


router.route('/:sub_id/:subt_id/:topic_id/:page').get((req, res) =>
        {
//            subforumsSchema.findOne(
//                    {
//                        _id: req.params.sub_id,
//                        'topics._id': req.params.subt_id
//                    },
//                    '$topics.title topics.$.topics',
//                    (error, data) =>
//            {
//                if (error)
//                {
//                    res.json({error: error});
//                } else
//                {
//                    let topic = "";
//                    for (let i = 0; i < data.topics[0].topics.length; i++) {
//                        if (data.topics[0].topics[i]._id == req.params.topic_id) {
//                            topic = data.topics[0].topics[i];
//                            break;
//                        }
//                    }
//                    res.json({topic: topic, subforum: {title: data.topics[0].title}});
//                }
//            });

            subforumsSchema.findOne(
                    {
                        _id: req.params.sub_id,
                        'topics._id': req.params.subt_id
                    },
                    '$topics.title topics.$.topics',
                    (error, data) =>
            {
                if (error)
                {
                    res.json({error: error});
                } else
                {
                    let topic = "";
                    for (let i = 0; i < data.topics[0].topics.length; i++) {
                        if (data.topics[0].topics[i]._id == req.params.topic_id) {
                            topic = data.topics[0].topics[i];
                            break;
                        }
                    }
                    let posts = topic.posts;
                    if (posts){
                    let postsToSend = [];
                    if (posts.length > perPageLimit * req.params.page) {
                        for (let i = (perPageLimit * req.params.page); i < posts.length && i < (perPageLimit * req.params.page) + perPageLimit; i++) {
                            postsToSend.push(posts[i]);
                        }
                    }
                    topic.posts = postsToSend;
                    console.log(req.params.page);
                    res.json({currentPage: req.params.page, availablePages: (Math.ceil(posts.length / perPageLimit)), topic: topic, subforum: {title: data.topics[0].title}});
                    }else{
                        res.json({error: "Posts not found for specified topic, topic possibly doesn't exist."});
                    }
                }
            });


        });

router.route('/:sub_id/:subt_id/:topic_id/new_post').put((req, res) =>
        {
            // let post = {_id: getNextSequenceValue("postid"), content: req.body.content, postedBy: req.body.postedBy};
            let post = {content: req.body.content, postedBy: req.body.postedBy};
            subforumsSchema.findOne({
                _id: req.params.sub_id,
                'topics._id': req.params.subt_id
            }, 'topics.topics.$.posts', (error, data) =>
            {
                if (error)
                {
                    res.json(error);
                } else
                {
                    let topics = data.topics[0].topics;
                    let availablePages = 1;
                    for (let i = 0; i < topics.length; i++) {
                        if (topics[i]._id == req.params.topic_id) {
                            topics[i].posts.push(post);
                            availablePages = Math.ceil(topics[i].posts.length / perPageLimit);
                            break;
                        }
                    }
                    subforumsSchema.findOneAndUpdate({
                        _id: req.params.sub_id,
                        'topics._id': req.params.subt_id,
                        'topics.topics._id': req.params.topic_id
                    }, {
                        $set: {'topics.$.topics': topics}
                    },
                            (error2, data2) => {
                        if (error2) {
                            res.json(error2);
                        } else {
                            
                            res.json({availablePages: availablePages});
                        }
                    }
                    );
                }
            });
        });

module.exports = router;

function getNextSequenceValue(sequenceName) {

    let sequenceDocument = countersSchema.findByIdAndUpdate(
            {_id: sequenceName},
            {$inc: {sequence_value: 1}}
    );
    console.log(sequenceDocument.sequence_value);
    return sequenceDocument.sequence_value;
}