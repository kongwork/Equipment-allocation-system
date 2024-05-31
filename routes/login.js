const express = require("express")
const router = express.Router()
const bcrypt = require('bcryptjs');
const User = require("../models/user")

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ UserName: username }).exec((err, doc) => {
        if (!doc || !bcrypt.compareSync(password, doc.Password)) {
            req.session.login_fail = true;
            req.session.cookie.maxAge = 1500;
            return res.redirect('/');
        }
        
        req.session.userid = doc._id;
        req.session.username = username;
        req.session.fname = doc.FirstName;
        req.session.lname = doc.LastName;
        req.session.phone = doc.PhoneNumber;
        req.session.login = true;

        if (doc.TypeUser == '01') {
            req.session.typeUser = 'User';
            return res.redirect("/category");
        } else if (doc.TypeUser == '00') {
            req.session.typeUser = 'Admin';
            return res.redirect("/user");
        } else {
            return res.redirect("/");
        }
    });
});

module.exports = router