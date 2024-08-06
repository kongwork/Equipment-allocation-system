const express = require("express")
const router = express.Router()
const Problem = require("../../../models/problem")

router.get("/problem", (req, res) => {
    const showname = req.session.username
    if (req.session.login) {
        if (req.session.typeUser == 'Admin') {
            Problem.find().populate('UserID').exec((err, doc) => {
                res.render("problem", {
                    type_user: req.session.typeUser,
                    problems: doc,
                    order: 1,
                    today: new Date(),
                    date: new Date(),
                    showname: showname
                })
            })
        }
        else {
            Problem.find({UserID: req.session.userid}).exec((err, doc) => {
                res.render("problem", {
                    type_user: req.session.typeUser,
                    problems: doc,
                    order: 1,
                    today: new Date(),
                    date: new Date(),
                    showname: showname
                })
            })
        }
    }
    else {
        res.redirect('/')
    }
})

module.exports = router