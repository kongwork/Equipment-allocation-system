const express = require("express")
const router = express.Router()
const Problem = require("../../../models/problem")

router.post("/insertProblem", (req, res) => {
    const name = req.body.problemName;
    const detail = req.body.problemDetail;

    let data = new Problem({
        UserID: req.session.userid,
        ProblemName: name,
        ProblemDetail: detail,
        ProblemSolving: '',
        Date: req.body.date,
        Status: '00'
    })
    Problem.saveProblem(data, (err) => {
        if (err) console.log(err)
        res.redirect("/problem");
    })
})

module.exports = router