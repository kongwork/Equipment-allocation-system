const express = require("express")
const router = express.Router()
const Device = require('../../../models/device')

router.get("/dispose/:id", (req, res) => {
    let data = {
        DateDispose: Date.now(),
        Status: '01'

    }
    // อัพเดตข้อมูล Device
    Device.findOneAndUpdate( {_id: req.params.id}, data, { useFindAndModify: false } ).exec(err => {
        res.redirect("/device")
    })
})

module.exports = router