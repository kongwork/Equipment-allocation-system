const express = require("express")
const router = express.Router()
const Category = require("../../../models/category")

router.post("/insertCategory", (req, res) => {
    const category = req.body.category;
    Category.findOne({ CategoryName: category }).exec((err, doc) => {
        if (!doc) {
            let data = new Category({
                CategoryName: category
            })
            Category.saveCategory(data, (err) => {
                if (err) console.log(err)
                res.redirect("/category")
            })
        }
        else {
            console.log(err)
        }
    })
})

module.exports = router