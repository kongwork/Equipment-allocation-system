const express = require("express")
const router = express.Router()

// logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/")
    })
    /*res.clearCookie('username')
    res.clearCookie("password")
    res.clearCookie("login")
    res.redirect("/")*/
})

module.exports = router