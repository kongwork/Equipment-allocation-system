const express = require("express")
const router = express.Router()
const Category = require('../../../models/category')

router.get("/delete_category/:id", (req, res) => {
    Category.findByIdAndDelete(req.params.id, { useFindAndModify: false }).exec(err => {
        if (err) console.log(err)
        res.redirect('/category')
    })
})

router.post("/MultiDeleteCategory", (req, res) => {
    const checkedItemId = req.body.deleteArray;
    const splitArray = checkedItemId.split(",");
    splitArray.forEach((item) => {
        Category.findByIdAndRemove(item, function (err) {
            if (!err) console.log(`Successfully deleted id: ${item}`);
        });
    });
    res.redirect("/category");
});

module.exports = router