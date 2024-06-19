const express = require("express")
const router = express.Router()
const Problem = require('../../../models/problem')

router.get("/delete_problem/:id", (req, res) => {
    Problem.findByIdAndDelete(req.params.id, { useFindAndModify: false }).exec(err => {
        if (err) console.log(err)
        res.redirect('/problem')
    })
})

router.post("/MultiDeleteProblems", (req, res) => {
    const checkedItemId = req.body.deleteArray;
    const splitArray = checkedItemId.split(",");
    splitArray.forEach((item) => {
        Problem.findByIdAndRemove(item, function (err) {
            if (!err) console.log(`Successfully deleted id: ${item}`);
        });
    });
    res.redirect("/problem");
});

module.exports = router