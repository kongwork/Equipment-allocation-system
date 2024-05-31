const express = require("express")
const router = express.Router()
const Order = require("../../../models/order")

function generateUniqueID() {
    let id = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const idLength = 5;

    for (let i = 0; i < idLength; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return id;
}

router.post("/add-order", async (req, res) => {
    try {
        const device_id = req.body.device_id;
        const existingOrder = await Order.findOne({ UserID: req.session.userid, Status: "00" })
        if (!existingOrder) {
            const newOrder = new Order({
                OrderID: generateUniqueID(),
                UserID: req.session.userid,
                DeviceID: [device_id],
                Date: '',
                Status: '00'
            });
            await newOrder.save();
            return res.redirect('/device');
        }

        const existingDevice = await Order.findOne({ UserID: req.session.userid, Status: "00", DeviceID: { $in: [device_id] } });

        if (existingDevice) {
            res.cookie('AddOrderFail', true, { maxAge: 1500 });
            return res.redirect("/device");
        }

        await Order.findOneAndUpdate(
            { UserID: req.session.userid, Status: "00", DeviceID: { $gte: [] } },
            { $push: { DeviceID: [device_id] } }
        );
        res.redirect('/device');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

router.post("/add-orders", async (req, res) => {
    const checkedItemId = req.body.addArray;
    const splitArray = checkedItemId.split(",");
    try {
        const existingOrder = await Order.findOne({ UserID: req.session.userid, Status: "00" })
        if (!existingOrder) {
            const newOrder = new Order({
                OrderID: generateUniqueID(),
                UserID: req.session.userid,
                DeviceID: splitArray,
                Date: '',
                Status: '00'
            });
            await newOrder.save();
            return res.redirect('/device');
        }

        const existingDevice = await Order.findOne({ UserID: req.session.userid, Status: "00", DeviceID: { $in: splitArray } });

        if (existingDevice) {
            res.cookie('AddOrderFail', true, { maxAge: 1500 });
            return res.redirect("/device");
        }

        await Order.findOneAndUpdate(
            { UserID: req.session.userid, Status: "00", DeviceID: { $gte: [] } },
            { $push: { DeviceID: { $each: splitArray } } }
        );
        res.redirect('/device');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})
/*router.post("/add-order", (req, res) => {
    let device_id = req.body.device_id
    Order.findOne({ UserID: req.session.userid, Status: "00" }).exec((err, order) => {
        if (!order) {
            let data = new Order({
                UserID: req.session.userid,
                DeviceID: [device_id],
                Date: '',
                Status: '00'
            })
            Order.saveOrder(data, (err) => {
                if (err) console.log(err)
                    return res.redirect('/device')
                
            })
        }
        Order.findOne({ UserID: req.session.userid, Status: "00", DeviceID: { $in: [device_id] } }).exec((err, order) => {
            if (order) {
                res.cookie('AddOrderFail', true, { maxAge: 1500 })
                return res.redirect("/device")
            }
            else {
                Order.findOneAndUpdate({ UserID: req.session.userid, Status: "00", DeviceID: { $gte: [] } }, { $push: { DeviceID: [device_id] } }).exec(err => {
                    return res.redirect('/device')
                })
            }
        })
    })
})*/

module.exports = router