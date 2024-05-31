const express = require("express")
const router = express.Router()
const Order = require('../../../models/order')

router.get("/del_order/:id/:deviceid", (req, res) => {
    Order.updateOne({DeviceID: req.params.id},{$pullAll: {DeviceID: [req.params.deviceid]}}).exec(err => {
        if (err) console.log(err)
        res.redirect('/order')
    })
})

module.exports = router