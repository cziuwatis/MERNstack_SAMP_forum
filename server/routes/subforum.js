let mongoose = require('mongoose');
let express = require('express');
let router = express.Router();

mongoose.set('useFindAndModify', false);

let subforumsSchema = require(`../models/forum`);
let userSchema = require(`../models/user`);
function getUserAccessLevel(userId) {
    userSchema.findById(userId,
            'role',
            (error, data) => {
        if (error) {
            return null;
        } else {
            return data.role;
        }
    }
    );
}

router.route('/:id').get((req, res) =>
{
    subforumsSchema.findById(req.params.id, 'topics', (error, data) =>
    {
        if (error)
        {
            res.json(error);
        } else
        {
            res.json(data);
        }
    });
});

router.route('/:sub_id/:subt_id/new_topic').put((req, res) =>
{
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
    let topic = req.body;
    topic.postedBy = req.session.user.userId;
    topic.posts[0].postedBy = req.session.user.userId;
    subforumsSchema.findOneAndUpdate({
        _id: req.params.sub_id,
        'topics._id': req.params.subt_id
    }, {
        $push: {
            'topics.$.topics': topic,
            $position: 0
        }
    }, {new : true}, (error, data) =>
    {
        if (error)
        {
            res.json(error);
        }
        res.json({_id: data.topics[0].topics[data.topics[0].topics.length - 1]._id});
    });
});

router.route('/:sub_id/:subt_id').get((req, res) =>
        {
            subforumsSchema.findOne({_id: req.params.sub_id, 'topics._id': req.params.subt_id}, 'topics.$._id topics.title topics.description topics.topics._id topics.topics.title topics.topics.postedBy topics.topics.creationDate topics.topics.posts', (error, data) =>
            {
                if (error)
                {
                    res.json({error: error});
                } else
                {
                    res.json(data.topics[0]);
                }
            });
        });

router.route('/:sub_id/:subt_id/page/:page').post((req, res) =>
        {
//    console.log(req.params.page);
//    subforumsSchema.paginate({
//        _id: req.params.sub_id,
//        'topics._id': req.params.subt_id
//    },
//            {
//                select: ['topics.$.topics'],
//                page: req.params.page,
//                limit: 0, //10 said is negative value so I set it to 10 to counteract that?
//                pagination: true
//            },
//            (error, data) => {
//        if (error) {
//            console.log(error);
//        } else {
//            //console.log(data);
//        }
//    }
//    );

//    subforumsSchema.aggregate([{
//            $match: {
//                _id: mongoose.Types.ObjectId(req.params.sub_id),
//                'topics._id': mongoose.Types.ObjectId(req.params.subt_id)
//            }}])
//            .exec((error, data) => {
//                if (error) {
//                    console.log(error);
//                } else {
//                    console.log(data[0]);
//                }
//            });

            let perPageLimit = 7;


            subforumsSchema.findOne(
                    {_id: req.params.sub_id, 'topics._id': req.params.subt_id},
                    'topics.$._id topics.title topics.description topics.topics._id topics.topics.title topics.topics.postedBy topics.topics.creationDate topics.topics.posts',
                    (error, data) =>
            {
                if (error)
                {
                    res.json({error: error});
                } else
                {
                    if (data) {
                        let topics = data.topics[0].topics;
                        if (req.body.sortBy) {
                            if (req.body.sortBy === 'latestPost') {
                                topics = topics.sort((a, b) => a.posts[a.posts.length - 1].postDate < b.posts[b.posts.length - 1].postDate ? 1 : -1);
                            } else if (req.body.sortBy === 'earliestPost') {
                                topics = topics.sort((a, b) => a.posts[a.posts.length - 1].postDate < b.posts[b.posts.length - 1].postDate ? -1 : 1);
                            } else if (req.body.sortBy === 'oldestTopic') {
                                topics = topics.sort((a, b) => a.creationDate < b.creationDate ? -1 : 1);
                            } else if (req.body.sortBy === 'newestTopic') {
                                topics = topics.sort((a, b) => a.creationDate < b.creationDate ? 1 : -1);
                            } else {
                                topics = topics.sort((a, b) => a.posts[a.posts.length - 1].postDate < b.posts[b.posts.length - 1].postDate ? 1 : -1);
                            }
                        } else {
                            topics = topics.sort((a, b) => a.posts[a.posts.length - 1].postDate < b.posts[b.posts.length - 1].postDate ? 1 : -1);
                        }
                        let topicsToSend = [];
                        if (topics.length > perPageLimit * req.params.page) {
                            for (let i = (perPageLimit * req.params.page); i < topics.length && i < (perPageLimit * req.params.page) + perPageLimit; i++) {
                                topicsToSend.push(
                                        {_id: topics[i]._id, title: topics[i].title, content: topics[i].posts[0].content, creationDate: topics[i].creationDate, postedBy: topics[i].postedBy, latestPost: {
                                                postDate: topics[i].posts[topics[i].posts.length - 1].postDate, postedBy: topics[i].posts[topics[i].posts.length - 1].postedBy},
                                            postCount: topics[i].posts.length}
                                );
                            }
                        }
                        let dataToSend = {
                            title: data.topics[0].title,
                            description: data.topics[0].description,
                            topics: topicsToSend,
                            page: req.params.page,
                            availablePages: Math.ceil(topics.length / perPageLimit)
                        };
                        res.json(dataToSend);
                    }
                }
            });
        });

router.route('/:id/new_subforum_topic').put((req, res) =>
        {
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
            subforumsSchema.findByIdAndUpdate(req.params.id, {$push: {
                    topics: {
                        title: "Subforum Topic Name",
                        description: "Subforum Topic description, what is it about?",
                        topics: []
                    }
                }}, (error, data) =>
            {
                if (error)
                {
                    res.json(error);
                }
                res.json(data);
            });

        });

router.route('/:id/update_subforum_topic/:topic_id').put((req, res, next) =>
        {
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
            subforumsSchema.findOneAndUpdate(
                    {_id: req.params.id, 'topics._id': req.params.topic_id},
                    {$set: {'topics.$.title': req.body.title, 'topics.$.description': req.body.description}},
                    {omitUndefined: true}, (error, data) =>
            {
                if (error)
                {
                    res.json(error);
                } else
                {
                    res.json(data);
                }
            });
        });

router.route('/delete_topic/:subforum/:subforumTopic/:topic').delete((req, res, next) =>
{
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
    subforumsSchema.find({_id: req.params.subforum, 'topics._id': req.params.subforumTopic}, 'topics.$.topics', (error, data) =>
    {
        if (error)
        {
            res.status(500).json({msg: null, error: error});
        } else
        {
            topics = data[0].topics[0].topics;
            let found = false;
            for (let i = 0; i < topics.length; i++) {
                if (topics[i]._id == req.params.topic) {
                    topics.splice(i, 1);
                    found = true;
                    break;
                }
            }
            if (found) {
                subforumsSchema.findOneAndUpdate(
                        {_id: req.params.subforum, 'topics._id': req.params.subforumTopic},
                        {$set: {'topics.$.topics': topics}},
                        (error, data) => {
                    if (error) {
                        res.status(500).json({msg: null, error: error});
                    } else {
                        res.status(200).json({msg: "successfully removed topic", error: error});
                    }
                }
                );
            } else {
                res.status(500).json({msg: null, error: "Something went wrong"});
            }
        }
    });
});

module.exports = router;