const express = require("express")
const router = express.Router()
const pdf = require('html-pdf')
const ejs = require('ejs')
const Device = require("../../../models/device")
const Order = require("../../../models/order")

router.get("/report-order/:order_id", (req, res) => {
    const today = new Date();
    const date = today.getDate() + ' / ' + (today.getMonth() + 1) + ' / ' + today.getFullYear();
    Order.findOne({ _id: req.params.order_id })
        .populate('UserID')
        .exec((err, order) => {
            if (err) {
                console.error(err);
                return;
            }
        Device.find({ _id: { $in: order.DeviceID } })
            .populate('CategoryID')
            .exec((err, devices) => {
                if (err) {
                    console.error(err);
                    return;
                }
                // โหลดไฟล์ EJS และสร้าง HTML จากข้อมูล
                ejs.renderFile('./views/report/reportOrder.ejs', {order,date,devices}, (err, html) => {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    // ตั้งค่าสำหรับการสร้าง PDF
                    const options = {format: 'A4'};

                    // สร้าง PDF และส่งกลับไปยังเบราว์เซอร์
                    pdf.create(html, options).toStream((err, stream) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal Server Error');
                            return;
                        }
                        // ตั้งค่า HTTP headers
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', 'inline; filename="output.pdf"'); // เปลี่ยน attachment เป็น inline
                        stream.pipe(res);
                    });
                });
            });
    });
})

module.exports = router