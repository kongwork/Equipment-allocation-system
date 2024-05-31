const express = require("express")
const router = express.Router()
const User = require("../../../models/user")
const Device = require("../../../models/device")
const Order = require("../../../models/order")

router.get("/order", (req, res) => {
    if (req.session.login && req.session.typeUser == 'User') {
        Order.find({ UserID: req.session.userid, Status: '00' }).populate('UserID').populate('DeviceID').exec((err, order) => {
            Device.find().populate('CategoryID').exec((err, device) => {
                User.findOne().exec((err, user) => {
                    res.render("order", {
                        type_user: req.session.typeUser,
                        showname: req.session.username,
                        order: order,
                        device: device,
                        user: user
                    })
                })
            })
        })
    }
    else if (req.session.login && req.session.typeUser == 'Admin') {
        Order.find({ Status: {$ne: '00'} }).populate('UserID', 'DeviceID').sort({
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
})

module.exports = router