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
function getUser(userId) {
    userSchema.findById(userId,
            (error, data) => {
        if (error) {
            return null;
        } else {
            return data;
        }
    }
    );
}
function getUserByEmail(email) {
    userSchema.findOne({email: email},
            (error, data) => {
        if (error) {
            return null;
        } else {
            return data;
        }
    }
    );
}

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



//register user
router.route('/register').post((req, res) =>
        {
            let username = req.body.username.trim();
            let password = req.body.password;
            let email = req.body.email.trim().toLowerCase();
            let error = "";
            if (username.length < 3 || username.length > 20 || /[^0-9a-zA-Z _-]+/.test(username)) {
                error = "Invalid username -> Needs to be with length between 3-20 characters and only with special characters like _ or -";
            } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.toLowerCase())) {
                error = "Invalid email";
            }
            if (error) {
                return res.json({error: error});
            }
            userSchema.findOne({email: email}, (error, data) => {
                if (data !== null) {
                    return res.json({error: "Email is already in use, please use another one or try logging in."});
                } else {
                    let salt = genRandomString(32);
                    user = {username: username, email: email, password: saltHashPassword(password, salt), salt: salt, role: 1};
                    // user.password = await saltHashPassword(password, salt);
                    userSchema.create(user, (error) =>
                    {
                        if (error)
                        {
                            return res.json(error);
                        }
                    });
                    req.session.user = {userId: getUserByEmail(email)._id};
                    res.json({msg: "Success!", accessLevel: 1, username: username});
                }
            });


        });


//login user
router.route('/login').post((req, res) => {
    userSchema.findOne({email: req.body.email}, (error, user) => {
        if (error) {
            res.json(error);
        } else {
            if (user) {
                let salt = user.salt;
                if (user.password === saltHashPassword(req.body.password, salt)) {
                    req.session.user = {userId: user._id};
                    res.json({valid: true, accessLevel: user.role, username: user.username});
                } else {
                    res.json({valid: false});
                }
            } else {
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