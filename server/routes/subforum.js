let mongoose = require('mongoose');
let express = require('express');
let router = express.Router();

mongoose.set('useFindAndModify', false);

let subforumsSchema = require(`../models/forum`);


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
            let topic = req.body;
            subforumsSchema.findOneAndUpdate({
                _id: req.params.sub_id,
                'topics._id': req.params.subt_id
            }, {
                $push: {
                    'topics.$.topics': topic,
                    $position: 0
                }
            }, (error, data) =>
            {
                if (error)
                {
                    res.json(error);
                }
                res.json(data);
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

router.route('/:sub_id/:subt_id/page/:page').get((req, res) =>
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

//page validation here
    subforumsSchema.findOne({_id: req.params.sub_id, 'topics._id': req.params.subt_id}, 'topics.$._id topics.title topics.description topics.topics._id topics.topics.title topics.topics.postedBy topics.topics.creationDate topics.topics.posts', (error, data) =>
    {
        if (error)
        {
            res.json({error: error});
        } else
        {
            //res.json(data.topics[0]);

            //console.log(data.topics[0]);
            let topics = data.topics[0].topics;
            let topicsToSend = [];
            if (topics.length > perPageLimit * req.params.page) {
                for (let i = (perPageLimit * req.params.page); i < topics.length && i < (perPageLimit * req.params.page) + perPageLimit; i++) {
                    topicsToSend.push(topics[i]);
                }
            }
            data.topics[0].topics = topicsToSend;
            data.page = req.params.page;
            data.availablePages = Math.ceil(topics.length % perPageLimit);
            res.json(data.topics[0]);
        }
    });
});

router.route('/:id/new_subforum_topic').put((req, res) =>
{
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

module.exports = router;