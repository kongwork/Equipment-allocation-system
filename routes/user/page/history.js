const express = require("express")
const router = express.Router()
const Order = require("../../../models/order")
const Device = require("../../../models/device")

router.get("/my-history", (req, res) => {
    if (req.session.login) {
        Order.find({ UserID: req.session.userid, Status: {$ne: '00'} }).populate('UserID', 'DeviceID').sort({
            date_withdraw: -1
        }).exec((err, order) => {
            Device.find({}).populate('CategoryID').exec((err, device) => {
                res.render("history", {
                    type_user: req.session.typeUser,
                    orders: order,
                    device: device,
                    showname: req.session.username,
                    today: new Date()
                })
            })
        })
    }
    else {
        res.redirect('/')
    }
})

module.exports = router