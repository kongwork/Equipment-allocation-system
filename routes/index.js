const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    if (req.session.login_fail != true) {
        res.render("index.ejs", { success: '' })
    }
    else {
        res.render("index.ejs", { success: 'Username หรือ Password ผิด' })
    }
})

module.exports = router