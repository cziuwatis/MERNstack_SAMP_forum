let mongoose = require('mongoose');
let express = require('express');
var crypto = require('crypto');
let router = express.Router();
let usersPerPageLimit = 8;
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
let subforumsSchema = require(`../models/forum`);

// read records on page
router.route('/').post((req, res) =>
        {
            let findQuery = {};
            if (req.body.last_id) {
                findQuery = {'_id': {'$gt': req.body.last_id}};
            }
            userSchema.find(findQuery, 'username country postCount role').limit(usersPerPageLimit).exec(function (error, data)
            {
                if (error)
                {
                    return res.json(error);
                } else
                {
                    if (data) {
                        let users = data;
                        res.json({users: users});
                    } else {
                        res.json({error: "No more data available"});
                    }
                }
            });

        });


// Read one record
router.route('/get_user/').get((req, res) =>
        {
            if (!req.session.user) {
                console.log("no user set");
                return res.json({error: 'User is not logged in, unable to edit user! (relog)'});
            } else if (!req.session.user.userId) {
                return res.json({error: "There has been an error with your login, please re-log. (relog)"});
            }
            userSchema.findById(req.session.user.userId, 'username email avatar country', (error, data) =>
            {
                if (error)
                {
                    return res.json({error: "There has been an error trying to find user details, try again later."});
                } else
                {
                    if (data) {
                        return res.json(data);
                    } else {
                        return res.json({error: "User was not found, please re-log and try again. (relog)"});
                    }
                }
            });

        });
router.route('/edit_user/').put((req, res) =>
        {
            console.log(req.session);
            console.log("edit user");
            if (!req.session.user) {
                console.log("no user set");
                return res.json({error: 'User is not logged in, unable to edit user! (relog)'});
            } else if (!req.session.user.userId) {
                return res.json({error: "There has been an error with your login, please re-log. (relog)"});
            }
            let toUpdate = {};
            let username = req.body.username;
            let password = req.body.password;
            let email = req.body.email;
            let error = "";
            if (username) {
                username = username.trim();
                if (username.length < 3 || username.length > 20 || /[^0-9a-zA-Z _-]+/.test(username)) {
                    error = "Invalid username -> Needs to be with length between 3-20 characters and only with special characters like _ or -";
                }
                toUpdate.username = username;
            }
            if (email) {
                email = email.trim().toLowerCase();
                if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.toLowerCase())) {
                    error = "Invalid email";
                }
                toUpdate.email = email;
            }
            if (error) {
                return res.json({error: error});
            }
            let salt = undefined;
            if (password) {
                salt = genRandomString(32);
                password = saltHashPassword(password, salt);
                toUpdate.salt = salt;
                toUpdate.password = password;
            }

            userSchema.findOneAndUpdate({_id: req.session.user.userId}, toUpdate, (error, data) =>
            {
                if (error)
                {
                    if (error.codeName.includes("DuplicateKey"))
                        return res.json({error: "Email and/or username is already in use, please use another one."});
                    else
                        return res.json({error: "There has been an error trying to find user details, try again later."});
                } else
                {
                    if (data) {
                        return res.json(data);
                    } else {
                        return res.json({error: "User was not found, please re-log and try again. (relog)"});
                    }
                }
            });

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
            userSchema.findOne({$or: [{email: email}, {username: username}]}, (error, data) => {
                if (data !== null) {
                    return res.json({error: "Email and/or username is already in use, please use another one or try logging in."});
                } else {
                    console.log("saltmines");
                    let salt = genRandomString(32);
                    user = {username: username, email: email, password: saltHashPassword(password, salt), salt: salt, role: 1};
                    // user.password = await saltHashPassword(password, salt);
                    userSchema.create(user, (error) =>
                    {
                        console.log("creating user?");
                        if (error)
                        {
                            return res.json({error: error});
                        }
                        console.log("searching user?");
                        userSchema.findOne({email: email},
                                (error, data) => {
                            console.log("found user?");
                            if (error) {
                                console.log(error);
                            } else {
                                console.log(data);
                                req.session.user = {userId: data._id};
                                res.json({msg: "Success!", accessLevel: 1, username: username});
                            }
                        }
                        );
                    });

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
router.route('/update_user/:id').put((req, res) =>
        {
            console.log(req.body);
            console.log(req.body.username);
            if (!req.session.user) {
                console.log("no user set");
                return res.json({error: 'User is not logged in, unable to edit user'});
            }
            userSchema.findById(req.session.user.userId,
                    'role',
                    (error, requestUser) => {
                if (requestUser === null) {
                    return res.json({error: 'Session user not found, please re-login'});
                } else {
                    let requestAccessLevel = requestUser.role;
                    if (requestAccessLevel < 5) {
                        return res.json({error: 'Insufficient permission'});
                    }
                    let username = req.body.username;
                    let email = req.body.email;
                    let query = {};
                    if (email) {
                        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.toLowerCase())) {
                            return  res.json({error: "Invalid email"});
                        }
                        query.email = email;
                        console.log("email" + email);
                    }
                    if (username) {
                        if (username.length < 3 || username.length > 20 || /[^0-9a-zA-Z _-]+/.test(username)) {
                            return res.json({error: "Invalid username -> Needs to be with length between 3-20 characters and only with special characters like _ or -"});
                        }
                        console.log("username " + username);
                        query.username = username;
                    }
                    console.log(query);
                    userSchema.findByIdAndUpdate(req.params.id,
                            {$set: query},
                            (error, searchUser) => {
                        if (error) {
                            if (error.codeName.includes("DuplicateKey")) {
                                return res.json({error: "Email and/or username is already taken, please use another one"});
                            }
                            return res.json({error: error.errmsg});
                        } else {
                            if (searchUser === null) {
                                return res.json({error: 'User not found, please refresh'});
                            } else {

                                res.json({msg: "success", username: query.username ? query.username : searchUser.username});
                            }
                        }
                    });
                }
            });

        });

router.route('/promote_user/:id').put((req, res) =>
        {

            if (!req.session.user) {
                console.log("no user set");
                return res.json({error: 'User is not logged in, unable to promote user'});
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
                    userSchema.findById(req.params.id,
                            'role',
                            (error, searchUser) => {
                        if (error) {
                            return null;
                        } else {
                            if (searchUser === null) {
                                return res.json({error: 'Promotion user not found, please refresh'});
                            }
                            toChangeAccessLevel = searchUser.role;
                            if (toChangeAccessLevel > requestAccessLevel) {
                                return res.json({error: "Cannot promote to a higher role than yourself"});
                            } else if (toChangeAccessLevel >= 5) {
                                return res.json({error: "Max promotion reached"});
                            }
                            userSchema.findByIdAndUpdate(req.params.id, {$inc: {role: 1}}, (error, data) =>
                            {
                                if (error)
                                {
                                    res.json({error: error});
                                } else
                                {
                                    res.json({msg: "User has been promoted"});
                                }
                            });
                        }
                    });
                }
            });

        });
router.route('/demote_user/:id').put((req, res) =>
        {

            if (!req.session.user) {
                console.log("no user set");
                return res.json({error: 'User is not logged in, unable to promote user'});
            } else if (req.session.user.userId === req.params.id) {
                return res.json({error: 'You cannot demote yourself'});
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
                    userSchema.findById(req.params.id,
                            'role',
                            (error, searchUser) => {
                        if (error) {
                            return null;
                        } else {
                            if (searchUser === null) {
                                return res.json({error: 'Demotion user not found, please refresh'});
                            }
                            toChangeAccessLevel = searchUser.role;
                            if (toChangeAccessLevel >= requestAccessLevel) {
                                return res.json({error: "Cannot demote a higher than or same role as yourself"});
                            } else if (toChangeAccessLevel === 0) {
                                return res.json({error: "Min promotion reached"});
                            }
                            userSchema.findByIdAndUpdate(req.params.id, {$inc: {role: -1}}, (error, data) =>
                            {
                                if (error)
                                {
                                    res.json({error: error});
                                } else
                                {
                                    res.json({msg: "User has been demoted"});
                                }
                            });
                        }
                    });
                }
            });
        });


// Delete one record
router.route('/delete_user/:id').delete((req, res, next) =>
        {
            if (!req.session.user) {
                console.log("no user set");
                return res.json({error: 'User is not logged in, unable to promote user'});
            } else if (req.session.user.userId === req.params.id) {
                return res.json({error: 'You cannot delete yourself'});
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
                    userSchema.findById(req.params.id,
                            'role username',
                            (error, searchUser) => {
                        if (error) {
                            return res.json({error: error});
                        } else {
                            if (searchUser === null) {
                                return res.json({error: 'Deletion user not found, please refresh'});
                            }
                            toChangeAccessLevel = searchUser.role;
                            if (toChangeAccessLevel > requestAccessLevel) {
                                return res.json({error: "Cannot delete a higher than or same role as yourself"});
                            } else if (toChangeAccessLevel >= 5) {
                                return res.json({error: "Max promotion reached"});
                            }
                            subforumsSchema.updateMany({},
                                    {
                                        $pull: {'topics.$[].topics': {'postedBy': req.params.id}
                                        }
                                    },
                                    (error) => {
                                if (error) {
                                    return res.json({error: "An error has occurred while deleting the user's topics, try again later"});
                                }
                                subforumsSchema.updateMany({},
                                        {
                                            $pull: {'topics.$[].topics.$[].posts': {'postedBy': req.params.id}
                                            }
                                        },
                                        (error) => {
                                    if (error) {
                                        return res.json({error: "An error has occurred while deleting the user's posts, try again later"});
                                    }
                                    userSchema.findByIdAndRemove(req.params.id, (error) =>
                                    {
                                        if (error) {
                                            return res.json({error: "An error occurred while deleting user, try again later"});
                                        }
                                        res.json({msg: "User and all of their content has been removed"});
                                    });
                                }
                                );
                            }
                            );
                        }
                    });
                }
            });
        });

router.route('/logout/').post((req, res, next) => {
    req.session.destroy();
});
module.exports = router;