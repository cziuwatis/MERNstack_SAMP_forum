let mongoose = require('mongoose');
let express = require('express');
let router = express.Router();

mongoose.set('useFindAndModify', false);

let userSchema = require(`../models/user`);

//
// validate one record
router.route('/validate_user/').post((req, res) =>
{
    console.log("validating user");
    userSchema.find({email: req.body.email}, (error, data) =>
    {
        if (error)
        {
            return next(error);
        } else
        {
            if (data.length > 0 && req.body.password === data[0].password) {
                //console.log(req.body.password);
                req.session.user = {accessLevel: 1};
                res.json({valid: true});
            } else {
                res.json({valid: false});
            }
            // res.json(data);
        }
    });

});

// read all records
router.route('/').get((req, res) =>
{
    if (typeof req.session.user === 'undefined')
    {
        // the user is not logged in
    } else {
        userSchema.find((error, data) =>
        {
            if (error)
            {
                return next(error);
            } else
            {
                res.json(data);
            }
        });
    }
});


// Read one record
router.route('/get_user/:id').get((req, res) =>
{
    if (typeof req.session.user === 'undefined')
    {
        // the user is not logged in
    } else {
        userSchema.findById(req.params.id, (error, data) =>
        {
            if (error)
            {
                return next(error);
            } else
            {
                res.json(data);
            }
        });
    }
});




// Add new record
router.route('/add_user').post((req, res, next) =>
{
    if (typeof req.session.user === 'undefined')
    {
        // the user is not logged in
    } else {
        userSchema.create(req.body, (error, data) =>
        {
            if (error)
            {
                return next(error);
            }
            res.json(data);
        });
    }
});


// Update one record
router.route('/update_user/:id').put((req, res, next) =>
{
    if (typeof req.session.user === 'undefined')
    {
        // the user is not logged in
    } else {
        userSchema.findByIdAndUpdate(req.params.id, {$set: req.body}, (error, data) =>
        {
            if (error)
            {
                return next(error);
            } else
            {
                res.json(data);
            }
        });
    }
});


// Delete one record
router.route('/delete_user/:id').delete((req, res, next) =>
{
    if (typeof req.session.user === 'undefined')
    {
        // the user is not logged in
    } else {
        userSchema.findByIdAndRemove(req.params.id, (error, data) =>
        {
            if (error)
            {
                return next(error);
            } else
            {
                res.status(200).json({msg: data});
            }
        });
    }
});

router.route('/logout/').post((req, res, next) => {
    req.session.destroy();
});

module.exports = router;