const express = require("express")
const router = express.Router()
const Category = require("../../../models/category")
const Device = require("../../../models/device")

// Edit Data Category
router.post("/EditCategory", (req, res) => {
    // ข้อมูลใหม่ที่ส่งมาจาก form edit
    const update_category = req.body.id_category
    let data = {
        CategoryName: req.body.category
    }
    // อัพเดตข้อมูล Category
    Category.findByIdAndUpdate(update_category, data, { useFindAndModify: false }).exec(err => {
        Device.updateMany({CategoryID:update_category}, data).exec(err => {
            console.log(req.body)
            res.redirect("/category")
        })
    })
})

module.exports = router;