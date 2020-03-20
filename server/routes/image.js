let mongoose = require('mongoose');
let express = require('express');
let router = express.Router();

mongoose.set('useFindAndModify', false);

let imageSchema = require(`../models/avatar`);
let multer = require('multer');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/profiles/');
    },
    filename: function (req, file, cb) {
        cb(null, req.session.user.userId + "." + file.mimetype.substring(6));
    }
});

let fileFilter = (req, file, cb) => {
    if (!req.session.user) {
        console.log("no user set");
        //return res.json({error: 'User is not logged in, unable to edit user! (relog)'});
        cb(null, false);
    } else if (!req.session.user.userId) {
       // return res.json({error: "There has been an error with your login, please re-log. (relog)"});
       cb(null, false);
    } else if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpe' || file.mimetype === 'image/gif' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

let upload = multer({
    storage: storage,
    limits: {
        filesize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.route('/upload').post(upload.single('imageData'), (req, res) => {
    console.log(req.file);
    if (!req.session.user) {
        console.log("no user set");
        return res.json({error: 'User is not logged in, unable to edit user! (relog)'});
    } else if (!req.session.user.userId) {
        return res.json({error: "There has been an error with your login, please re-log. (relog)"});
    }
    if (!req.file) {
        return res.json({error: "File is either too big or it is of the wrong format"});
    }
    imageSchema.create({
        imageName: req.body.imageName,
        imageData: req.file.path
    }, (error, data) => {
        console.log(error);
        console.log(data);
    });

});



module.exports = router;