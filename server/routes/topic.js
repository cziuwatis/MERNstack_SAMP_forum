let mongoose = require('mongoose');
let express = require('express');
let router = express.Router();
const perPageLimit = 7;
mongoose.set('useFindAndModify', false);

let subforumsSchema = require(`../models/forum`);
let countersSchema = require(`../models/counter`);
let userSchema = require(`../models/user`);
function getUserAccessLevel(userId) {
    userSchema.findById(userId,
            'role',
            (error, data) => {
        if (error) {
            console.log(error);
            return null;
        } else {
            console.log(data);
            return data.role;
        }
    }
    );
}
//get topic content
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

//get topic content on certain page
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
            if (posts) {
                let postsToSend = [];
                if (posts.length > perPageLimit * req.params.page) {
                    for (let i = (perPageLimit * req.params.page); i < posts.length && i < (perPageLimit * req.params.page) + perPageLimit; i++) {
                        postsToSend.push(posts[i]);
                    }
                }
                console.log("posts");
                console.log(posts);
                console.log(posts.map(post => post.postedBy));
                userSchema.find({_id: {$in: posts.map(post => post.postedBy)}}, (error, data)=>{
                    console.log(error);
                    console.log(data);
                });
                
                topic.posts = postsToSend;
                res.json({currentPage: req.params.page, availablePages: (Math.ceil(posts.length / perPageLimit)), topic: topic, subforum: {title: data.topics[0].title}});
            } else {
                res.json({error: "Posts not found for specified topic, topic possibly doesn't exist."});
            }
        }
    });


});

//create new post in topic
router.route('/:sub_id/:subt_id/:topic_id/new_post').put((req, res) =>
{
    // let post = {_id: getNextSequenceValue("postid"), content: req.body.content, postedBy: req.body.postedBy};
    if (!req.session.user) {
        console.log("no user set");
        return res.json({error: 'User is not logged, unable to create a new post'});
    } else if (req.session.user.userId) {
        //check accessLevel
        let accessLevel = getUserAccessLevel(req.session.user.userId);
        if (accessLevel < 1) {
            return res.json({error: 'Insufficient permission'});
        }
    }
    else{
        return res.json({error: "userId doesn't exist"});
    }
    let post = {content: req.body.content, postedBy: req.session.user.userId};
    console.log(post);
    subforumsSchema.findOneAndUpdate({
        _id: req.params.sub_id,
        'topics._id': req.params.subt_id,
        'topics.topics._id': req.params.topic_id
    },
            {$push: {'topics.$.topics.$[elem].posts': post}},
            {
                new : true,
                arrayFilters: [{'elem._id': req.params.topic_id}]
            }, (error, data) => {
        if (error) {
            res.json(error);
        } else {
            let topics = data.topics[0].topics;
            let availablePages = 1;
            for (let i = 0; i < topics.length; i++) {
                if (topics[i]._id == req.params.topic_id) {
                    availablePages = Math.ceil((topics[i].posts.length) / perPageLimit);
                    break;
                }
            }
            res.json({msg: 'success', availablePages: availablePages});
        }
    });

//    subforumsSchema.findOne({
//        _id: req.params.sub_id,
//        'topics._id': req.params.subt_id
//    }, 'topics.topics.$.posts', (error, data) =>
//    {
//        if (error)
//        {
//            res.json(error);
//        } else
//        {
//            let topics = data.topics[0].topics;
//            let availablePages = 1;
//            for (let i = 0; i < topics.length; i++) {
//                if (topics[i]._id == req.params.topic_id) {
//                    topics[i].posts.push(post);
//                    availablePages = Math.ceil(topics[i].posts.length / perPageLimit);
//                    break;
//                }
//            }
//            subforumsSchema.findOneAndUpdate({
//                _id: req.params.sub_id,
//                'topics._id': req.params.subt_id,
//                'topics.topics._id': req.params.topic_id
//            }, {
//                $set: {'topics.$.topics': topics}
//            },
//                    (error2, data2) => {
//                if (error2) {
//                    res.json(error2);
//                } else {
//
//                    res.json({availablePages: availablePages});
//                }
//            }
//            );
//        }
//    });
});



//edit certain topic
router.route('/:sub_id/:subt_id/edit_topic').put((req, res) => {
    if (!req.session.user) {
        console.log("no user set");
        return res.json({error: 'User is not logged, unable to create a new post'});
    } else if (req.session.user.userId) {
        //check accessLevel
        let accessLevel = getUserAccessLevel(req.session.user.userId);
        if (accessLevel < 4) {
            return res.json({error: 'Insufficient permission'});
        }
    }
    subforumsSchema.findOneAndUpdate({
        _id: req.params.sub_id,
        'topics._id': req.params.subt_id,
        'topics.topics._id': req.body._id
    },
            {$set: {'topics.$.topics.$[elem].posts.0.content': req.body.content,
                    'topics.$.topics.$[elem].title': req.body.title}},
            {
                new : true,
                arrayFilters: [{'elem._id': req.body._id}]
            }, (error, data) => {
        console.log(error);
        console.log(data);
        if (error) {
            res.json(error);
        } else {
            res.json({msg: 'success', error: error});
        }
    });

//    subforumsSchema.findOne({
//        _id: req.params.sub_id,
//        'topics._id': req.params.subt_id
//    },
//            'topics.$.topics',
//            (error, data) => {
//        if (error) {
//            res.json({msg: null, error: error});
//        } else {
//            topics = data.topics[0].topics;
//            for (let i = 0; i < topics.length; i++) {
//                if (topics[i]._id == req.body._id) {
//                    topics[i].title = req.body.title;
//                    topics[i].posts[0].content = req.body.content;
//                    break;
//                }
//            }
//            subforumsSchema.findOneAndUpdate(
//                    {_id: req.params.sub_id, 'topics._id': req.params.subt_id},
//                    {$set: {'topics.$.topics': topics}},
//                    (error, data) => {
//                if (error) {
//                    res.status(500).json({msg: null, error: error});
//                } else {
//                    res.status(200).json({msg: "successfully updated topic", error: error});
//                }
//            }
//            );
//        }
//    }
//    );
});

//delete a post from topic
router.route('/delete_post/:sub_id/:subt_id/:top_id/:post_id').delete((req, res) => {
    if (!req.session.user) {
        console.log("no user set");
        return res.json({error: 'User is not logged, unable to create a new post'});
    } else if (req.session.user.userId) {
        //check accessLevel
        let accessLevel = getUserAccessLevel(req.session.user.userId);
        if (accessLevel < 4) {
            return res.json({error: 'Insufficient permission'});
        }
    }
    subforumsSchema.findOneAndUpdate({
        _id: req.params.sub_id,
        'topics._id': req.params.subt_id,
        'topics.topics._id': req.params.top_id
    },
            {$pull: {'topics.$.topics': {'posts.0._id': req.params.post_id}}}, //pull topic out if the post deleted is the first post of topic
            (error, data) => {
        if (error) {
            res.json(error);
        } else {
            subforumsSchema.findOneAndUpdate({
                _id: req.params.sub_id,
                'topics._id': req.params.subt_id,
                'topics.topics._id': req.params.top_id,
                'topics.topics.posts._id': req.params.post_id
            },
                    {$pull: {'topics.$.topics.$[elem].posts': {_id: req.params.post_id}}},
                    {
                        new : true,
                        arrayFilters: [{'elem._id': req.params.top_id}]
                    }, (error, data) => {
                if (error) {
                    return  res.json(error);
                } else {
                    let response = {};
                    if (data === null) {
                        response.error = "Posts not found for specified topic";
                    } else {
                        let topics = data.topics[0].topics;
                        for (let i = 0; i < topics.length; i++) {
                            if (topics[i]._id == req.params.top_id) {
                                response.availablePages = Math.ceil(topics[i].posts.length / perPageLimit);
                                break;
                            }
                        }
                    }
                    console.log(response);
                    res.json(response);

                }
            });
        }
    });



//    subforumsSchema.findOne({
//        _id: req.params.sub_id,
//        'topics._id': req.params.subt_id
//    },
//            'topics.$.topics',
//            (error, data) => {
//        if (error) {
//            res.json({msg: null, error: error});
//        } else {
//            topics = data.topics[0].topics;
//            topic = {};
//            let foundAt = -1;
//            for (let i = 0; i < topics.length; i++) {
//                if (topics[i]._id == req.params.top_id) {
//                    topic = topics[i];
//                    foundAt = i;
//                    break;
//                }
//            }
//            if (foundAt >= 0) {
//                for (let i = 0; i < topic.posts.length; i++) {
//                    if (topic.posts[i]._id == req.params.post_id) {
//                        if (i != 0) {
//                            topic.posts.splice(i, 1);
//                            topics[foundAt] = topic;
//                        } else {
//                            topics.splice(foundAt, 1);
//                        }
//                        subforumsSchema.findOneAndUpdate(
//                                {_id: req.params.sub_id, 'topics._id': req.params.subt_id},
//                                {$set: {'topics.$.topics': topics}},
//                                (error, data) => {
//                            if (error) {
//                                res.status(500).json({msg: null, error: error});
//                            } else {
//                                res.status(200).json({msg: "successfully deleted post", availablePages: Math.ceil(topic.posts.length / perPageLimit), error: error});
//                            }
//                        }
//                        );
//                        break;
//                    }
//                }
//            } else {
//                res.status(500).json({msg: null, error: 'Topic was not found'});
//            }
//
//        }
//    }
//    );
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