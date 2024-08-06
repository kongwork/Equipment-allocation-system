const express = require("express")
const router = express.Router()
const Order = require('../../../models/order')

router.get("/del_order/:id/:deviceid", (req, res) => {
    console.log(req.params.id)
    console.log(req.params.deviceid)
    
    Order.updateOne(
        { _id: req.params.id },
        { $pull: { DeviceID: req.params.deviceid } }
    ).exec((err, result) => {
        if (err) {
            console.log("Error:", err);
            return res.status(500).send("Internal server error");
        }
        if (result.nModified === 0) {
            console.log("No document found or nothing was updated");
            return res.status(404).send("Order not found or device ID not in array");
        }
        console.log("Update result:", result);
        res.redirect('/order');
    });
});

module.exports = router