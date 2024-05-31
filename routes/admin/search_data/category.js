const express = require("express")
const router = express.Router()
const Category = require('../../../models/category')
const Device = require("../../../models/device")

router.post("/searchCategory", async (req, res) => {
    try {
        const { username: showname, typeUser } = req.session
        const search = req.body.search

        if (!search) {
            return res.redirect("/category")
        }

        const query = { CategoryName: { $regex: '^' + search, $options: 'i' } }
        const devices = await Device.find().exec()
        const categorys = await Category.find(query).exec()

        res.render("category", {
            type_user: typeUser,
            devices: devices,
            categorys: categorys,
            order: 1,
            showname: showname
        })
    } catch (err) {
        console.error(err)
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router