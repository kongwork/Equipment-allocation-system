const express = require("express")
const router = express.Router()
const User = require('../../../models/user')

router.get("/delete_user/:id", (req, res) => {
    User.findByIdAndDelete(req.params.id, { useFindAndModify: false }).exec(err => {
        if (err) console.log(err)
        res.redirect('/user')
    })
})

router.post("/MultiDelete", (req, res) => {
    const checkedItemId = req.body.deleteArray;
    const splitArray = checkedItemId.split(",");
    splitArray.forEach((item) => {
        User.findByIdAndRemove(item, function (err) {
            if (!err) console.log(`Successfully deleted id: ${item}`);
        });
    });
    res.redirect("/user");
});

module.exports = router