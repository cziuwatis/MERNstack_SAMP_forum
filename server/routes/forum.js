let mongoose = require('mongoose');
let express = require('express');
let router = express.Router();

mongoose.set('useFindAndModify', false);

let subforumsSchema = require(`../models/forum`);


router.route('/').get((req, res) =>
        {
            subforumsSchema.find((error, data) =>
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

router.route('/new_subforum').put((req, res) =>
        {
            subforumsSchema.create({title: "Subforum name"}, (error, data) =>
            {
                if (error)
                {
                    res.json(error);
                }
                res.json(data);
            });

        });

router.route('/delete_subforum/:id').delete((req, res, next) =>
        {
            subforumsSchema.findByIdAndRemove(req.params.id, (error, data) =>
            {
                if (error)
                {
                    res.status(500).json({msg: null, error: error});
                } else
                {
                    res.status(200).json({msg: data, error: error});
                }
            });
        });

router.route('/update_subforum/:id').put((req, res, next) => 
{
    subforumsSchema.findByIdAndUpdate(req.params.id, {$set: {title: req.body.title}}, (error, data) => 
    {
        if (error) 
        {
            res.json(error);
        } 
        else 
        {
            res.json(data);
        }
    });
});


module.exports = router;