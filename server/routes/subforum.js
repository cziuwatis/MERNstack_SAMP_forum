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