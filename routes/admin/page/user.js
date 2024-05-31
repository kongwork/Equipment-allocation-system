const express = require("express")
const router = express.Router()
const User = require("../../../models/user")

router.get("/user", (req, res) => {
    const showname = req.session.username
    if (req.session.login && (req.session.typeUser == 'Admin' || req.session.typeUser == 'Technician')) {
        User.find().exec((err, doc) => {
                    res.render("user", {
                        type_user: req.session.typeUser,
                        users: doc,
                        order: 1,
                        showname: showname
                    })
        })
    }
    else {
        res.redirect('/')
    }
})

module.exports = router