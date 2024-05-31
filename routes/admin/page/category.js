const express = require("express")
const router = express.Router()
const Category = require("../../../models/category")
const Device = require("../../../models/device")

router.get("/category", (req, res) => {
    const showname = req.session.username
    if (req.session.login) {
        let order = 1
        Category.find().exec((err, doc) => {
            Device.find().exec((err, doc_d) => {
                res.render("category", {
                    type_user: req.session.typeUser,
                    categorys: doc,
                    devices: doc_d,
                    order: order,
                    showname: showname
                })
            })
        })
    }
    else {
        res.redirect('/')
    }
})

module.exports = router