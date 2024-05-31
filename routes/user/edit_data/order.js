const express = require("express")
const router = express.Router()
const Order = require("../../../models/order")
const Device = require("../../../models/device")

router.get("/confirm-order", async (req, res) => {
    try {
        let data = {
            UserID: req.session.userid,
            Status: '00'
        }
        const existingOrder = await Order.findOne({ UserID: req.session.userid, Status: "00" })
        const checkDevices = await Device.find({ _id: { $in: existingOrder.DeviceID } })
        /*
        Array.some(): เมื่อถูกเรียกบนอาร์เรย์ จะทำการวนลูปผ่านสมาชิกของอาร์เรย์ และหยุดการทำงานทันทีเมื่อพบสมาชิกที่ทำให้เงื่อนไขที่กำหนดเป็นจริง (true)
        การทำงานของฟังก์ชันจะหยุดทันที และคืนค่า true หากมีสมาชิกใดๆ ที่ผ่านเงื่อนไข หากไม่มีสมาชิกใดที่ผ่านเงื่อนไขจะคืนค่า false

        Array.every(): เมื่อถูกเรียกบนอาร์เรย์ จะทำการวนลูปผ่านสมาชิกของอาร์เรย์ และหยุดการทำงานทันทีเมื่อพบสมาชิกที่ทำให้เงื่อนไขที่กำหนดเป็นเท็จ (false)
        การทำงานของฟังก์ชันจะหยุดทันที และคืนค่า false หากมีสมาชิกใดๆ ที่ไม่ผ่านเงื่อนไข หากสมาชิกทุกตัวผ่านเงื่อนไขจะคืนค่า true */
        
        if (checkDevices.some(device => device.Status !== '00')) {
            res.cookie('ConfirmOrderFail', true, { maxAge: 1500 });
            return res.redirect("/order");
        }

        await Order.findOneAndUpdate(data, { Status: '01' })
        await Device.updateMany({ _id: { $in: existingOrder.DeviceID } }, { Status: '02' })
        res.redirect('/my-history')
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

router.post("/cancel-order",async (req, res) => {
    if (req.session.typeUser == 'Admin'){
        try {
            const existingOrder = await Order.findOne({ _id: req.body.order_id, Status: "01" })
            await Device.updateMany({ _id: { $in: existingOrder.DeviceID } }, { Status: '03' },)
            await Order.findOneAndUpdate({ _id: req.body.order_id, Status: "01" }, { Status: '02', Date: Date.now() })
            res.redirect('/order')
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
    else {
        let data = {
            UserID: req.session.userid,
            Status: '01'
        }
        Order.findOne({ UserID: req.session.userid, Status: "01" }).exec((err, order) => {
            Order.findOneAndUpdate(data, { Status: '03', Date: Date.now() }).exec(err => {
                Device.updateMany({ _id: { $in: order.DeviceID } }, { Status: '00' }).exec(err => {
                    res.redirect("/my-history")
                })
            })
        })
    }
})

router.post("/returnDevices",async (req, res) => {
    try {
        const orderId = req.body.orderId
        const existingOrder = await Order.findOne({ _id: orderId, Status: "02" })
        await Device.updateMany({ _id: { $in: existingOrder.DeviceID } }, { Status: '00' },)
        await Order.findOneAndUpdate({ _id: orderId }, { Status: '04' })
        res.redirect('/order')
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router