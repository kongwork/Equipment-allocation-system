const express = require("express")
const router = express.Router()
const Problem = require("../../../models/problem")

router.post("/EditProblem", (req, res) => {

    const problemID = req.body.id
    const detailSolving = req.body.problemSolving;

    let data = {
        ProblemSolving: detailSolving,
        Status: '01'
    }

    Problem.findByIdAndUpdate(problemID, data, { useFindAndModify: false }).exec(err => {
        res.redirect("/problem")
    })
})

module.exports = router;