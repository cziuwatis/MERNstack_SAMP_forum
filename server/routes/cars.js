let mongoose = require('mongoose');
let express = require('express');
let router = express.Router();

mongoose.set('useFindAndModify', false);

let carSchema = require(`../models/car`);


// read all records
router.route('/').get((req, res) =>
{
    //console.log(req.session);
    if (typeof req.session.user === 'undefined')
    {
        // the user is not logged in
    } else {
        carSchema.find((error, data) =>
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
})


// Read one record
router.route('/get_car/:id').get((req, res) =>
{
    carSchema.findById(req.params.id, (error, data) =>
    {
        if (error)
        {
            return next(error);
        } else
        {
            res.json(data);
        }
    })
})


// Add new record
router.route('/add_car').post((req, res, next) =>
{
    carSchema.create(req.body, (error, data) =>
    {
        if (error)
        {
            return next(error);
        }
        res.json(data);
    })
})


// Update one record
router.route('/update_car/:id').put((req, res, next) =>
{
    carSchema.findByIdAndUpdate(req.params.id, {$set: req.body}, (error, data) =>
    {
        if (error)
        {
            return next(error);
        } else
        {
            res.json(data);
        }
    })
})


// Delete one record
router.route('/delete_car/:id').delete((req, res, next) =>
{
    carSchema.findByIdAndRemove(req.params.id, (error, data) =>
    {
        if (error)
        {
            return next(error);
        } else
        {
            res.status(200).json({msg: data});
        }
    })
})

module.exports = router;