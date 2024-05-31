const express = require("express")
const router = express.Router()
const Device = require('../../../models/device')
const Order = require('../../../models/order')

router.get("/delete_device/:id", (req, res) => {
    Device.findByIdAndDelete(req.params.id, { useFindAndModify: false }).exec(err => {
        Order
        if (err) console.log(err)
        res.redirect('/device')
    })
    try {

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

router.post("/MultiDeleteDevice", (req, res) => {
    const checkedItemId = req.body.deleteArray;
    const splitArray = checkedItemId.split(",");
    splitArray.forEach((item) => {
        Device.findByIdAndRemove(item, function (err) {
            if (!err) console.log(`Successfully deleted id: ${item}`);
        });
    });
    res.redirect("/device");
});

module.exports = router