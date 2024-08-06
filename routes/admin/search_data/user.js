const express = require("express")
const router = express.Router()
const User = require('../../../models/user')

router.post("/user/search", (req, res) => {
    const showname = req.session.username
    let order = 1
    let query = { 
        $or: [
            { UserID: { $regex: '^' + req.body.search, $options: 'i' } },
            { FirstName: { $regex: '^' + req.body.search, $options: 'i' } }
        ]
    }
    let input_search_null = req.body.search
    if (req.session.login && req.session.typeUser == 'Admin') {
        if (input_search_null === "") {
            res.redirect("/user") 
        }
        else {
            User.find(query).exec((err, doc) => {
                res.render("user", {
                    type_user: req.session.typeUser,
                    users: doc,
                    order: order,
                    showname: showname
                })
                console.log(doc)
            })
        }
    }
    else {
        res.redirect('/')
    }
})

module.exports = router