let mongoose = require('mongoose');
let express = require('express');
var crypto = require('crypto');
let router = express.Router();
//password hashing from https://ciphertrick.com/salt-hash-passwords-using-nodejs-crypto/
/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
let genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0, length);   /** return required number of characters */
};
/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
let sha512 = function (password, salt) {
    let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    let value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};
function saltHashPassword(userpassword, salt) {
    //let salt = genRandomString(32); /** Gives us salt of length 16 */
    let passwordData = sha512(userpassword, salt);
    return passwordData.passwordHash;
}
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




router.route('/register').post((req, res) =>
        {
            console.log("hey");
            let username = req.body.username.trim();
            let password = req.body.password;
            let email = req.body.email.trim();
            let error = "";
            if (username.length < 3 || username.length > 20 || /[^0-9a-zA-Z _-]+/.test(username)) {
                error = "Invalid username -> Needs to be with length between 3-20 characters and only with special characters like _ or -";
            } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.toLowerCase())) {
                error = "Invalid email";
            }
            if (error) {
                console.log(error);
                return res.json({error: error});
            }
            userSchema.findOne({email: email}, (error, data) => {
                if (data !== null) {
                    console.log("email used");
                    return res.json({error: "Email is already in use, please use another one or try logging in."});
                } else {
                        console.log("sup");
                        let salt = genRandomString(32);
                        user = {username: username, email: email, password: saltHashPassword(password, salt), salt: salt};
                       // user.password = await saltHashPassword(password, salt);
                        console.log(user.password);
                        userSchema.create(user, (error) =>
                        {
                            if (error)
                            {
                                return res.json(error);
                            }
                        });
                        //req.session.user = {accessLevel: 1};
                        res.json({msg:"Success!"});
                }
            });


        });



router.route('/login').post((req, res) =>{
    userSchema.findOne({email: req.body.email}, (error, user)=>{
       if (error){
           res.json(error);
       }else{
           if (user){
               let salt = user.salt;
               if (user.password === saltHashPassword(req.body.password, salt)){
                   //req.session.user = {accessLevel: 1};
                   res.json({valid: true, accessLevel: user.role});
               }else{
                   res.json({valid: false});
               }
           }else{
               res.json({valid: false});
           }
       }
    });
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