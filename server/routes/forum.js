let mongoose = require('mongoose');
let express = require('express');
let router = express.Router();

mongoose.set('useFindAndModify', false);

let subforumsSchema = require(`../models/forum`);
let userSchema = require(`../models/user`);

let defaultServerHostname = 'Rls.lt 0.3.7 | Realus Lietuvos Serveris';
let defaultServerVersion = '0.3.7-R2';
let defaultServerIp = 'samp.rls.lt';
let defaultMaxPlayers = 300;
let query = require('samp-query');
let serverOptions = {
    host: defaultServerIp
};
//
//function getUserAccessLevel(userId) {
//    userSchema.findById(userId,
//            'role',
//            (error, data) => {
//        if (error) {
//            return null;
//        } else {
//            return data.role;
//        }
//    }
//    );
//}
router.route('/server_stats').get((req, res) =>
{
    query(serverOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.json({hostname: defaultServerHostname, version: defaultServerVersion, ip: defaultServerIp, maxPlayers: defaultMaxPlayers, playerCount: 0});
        } else {
            res.json({hostname: response.hostname, version: response.rules.version, ip: defaultServerIp, maxPlayers: response.maxplayers, playerCount: response.online});
        }
    });

});

router.route('/').get((req, res) =>
{
    subforumsSchema.find()
            .sort('index')
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
        return res.json({error: 'User is not logged in, please relog'});
    }
    userSchema.findById(req.session.user.userId,
            'role',
            (error, requestUser) => {
        if (requestUser === null) {
            return res.json({error: 'Session user not found, please re-login'});
        } else {
            let requestAccessLevel = requestUser.role;
            if (requestAccessLevel < 4) {
                return res.json({error: 'Insufficient permission'});
            }
            subforumsSchema.updateMany({}, {$inc: {index: +1}}, (error, data) => {
                subforumsSchema.create({title: "Subforum name", index: 0}, (error, data) =>
                {
                    if (error)
                    {
                        res.json(error);
                    }
                    res.json(data);
                });
            }
            );
        }
    });

});

router.route('/delete_subforum/:id').delete((req, res, next) =>
{
    if (!req.session.user) {
        console.log("no user set");
        return res.json({error: 'User is not logged in, please relog'});
    }
    userSchema.findById(req.session.user.userId,
            'role',
            (error, requestUser) => {
        if (requestUser === null) {
            return res.json({error: 'Session user not found, please re-login'});
        } else {
            let requestAccessLevel = requestUser.role;
            if (requestAccessLevel < 4) {
                return res.json({error: 'Insufficient permission'});
            }
            subforumsSchema.findByIdAndRemove(req.params.id, (error, data) =>
            {
                if (error)
                {
                    res.status(500).json({msg: null, error: error});
                } else
                {
                    if (data) {
                        subforumsSchema.updateMany({index: {$gt: data.index}}, {$inc: {index: -1}}, (error, response) => {
                            if (error) {
                                console.log(error);
                            }
                        });
                    }
                    res.status(200).json({msg: data, error: error});
                }
            });
        }
    });
});

router.route('/update_subforum/:id').put((req, res) =>
        {
            if (!req.session.user) {
                console.log("no user set");
                return res.json({error: 'User is not logged in, please relog'});
            }
            userSchema.findById(req.session.user.userId,
                    'role',
                    (error, requestUser) => {
                if (requestUser === null) {
                    return res.json({error: 'Session user not found, please re-login'});
                } else {
                    let requestAccessLevel = requestUser.role;
                    if (requestAccessLevel < 4) {
                        return res.json({error: 'Insufficient permission'});
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
                }
            });
        });

router.route('/move_subforum/:id').put((req, res) =>
        {
            if (!req.session.user) {
                console.log("no user set");
                return res.json({error: 'User is not logged in, please relog'});
            }
            userSchema.findById(req.session.user.userId,
                    'role',
                    (error, requestUser) => {
                if (requestUser === null) {
                    return res.json({error: 'Session user not found, please re-login'});
                } else {
                    let requestAccessLevel = requestUser.role;
                    if (requestAccessLevel < 4) {
                        return res.json({error: 'Insufficient permission'});
                    }
                    let moveBy = parseInt(req.body.moveBy);
                    if (!moveBy) {
                        return res.json({error: 'Move by cannot be empty'});
                    } else {
                        if (moveBy < 0) {
                            moveBy = -1;
                        } else {
                            moveBy = 1;
                        }
                    }
                    subforumsSchema.findOneAndUpdate({_id: req.params.id}, {$inc: {index: moveBy}}, {new : true}, (error, data) => {
                        if (error) {
                            return res.json({error: error.errmsg});
                        }
                        if (data) {
                            subforumsSchema.updateOne({index: data.index, _id: {$not: {$eq: data._id}}}, {$inc: {index: -moveBy}}, (error, res2) => {
                                if (error) {
                                    return res.json({error: error.errmsg});
                                }
                                if (res2.n === 0) {//subforum on edge, have to move index back to position
                                    subforumsSchema.updateOne({_id: data._id}, {$inc: {index: -moveBy}}, (error, response) => {
                                        if (error) {
                                            return res.json({error: error.errmsg});
                                        }
                                        res.json({msg: "success"});
                                    });
                                } else {
                                    res.json({msg: "success"});
                                }
                            });
//                    let condition = {$gt: data.index};
//                    if (moveBy < 0){
//                        condition = {$lt: data.index};
//                    }
//                    subforumsSchema.updateMany({$or:[{index: condition}, {index: data.index}]}, {$inc: {index: moveBy}}, (error) =>
//                    {
//                        if (error)
//                        {
//                            return res.json({error: error.errmsg});
//                        } else
//                        {
//                            subforumsSchema.update({index: condition}, {$inc: {index: (-2 * moveBy)}}, (error, data)=>{
//                               console.log(error);
//                               console.log(data);
//                            });
//                        }
//                    });
                        } else {
                            return res.json({error: "Subforum not found, please reload page"});
                        }

                    });
                }
            });
        });



module.exports = router;