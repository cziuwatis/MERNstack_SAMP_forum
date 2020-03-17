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

router.route('/').get((req, res) =>
{
    subforumsSchema.find()
            .populate({
                path: 'topics.topics.postedBy',
                model: 'user',
                select: 'username role'
            })
            .exec(function (error, data)
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
            subforumsSchema.findByIdAndUpdate(req.params.id, {$set: {title: req.body.title}}, (error, data) =>
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