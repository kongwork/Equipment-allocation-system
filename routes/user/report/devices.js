const express = require("express")
const router = express.Router()
const pdf = require('html-pdf')
const ejs = require('ejs')
const Device = require("../../../models/device")

router.post("/report-devices", (req, res) => {
    let startDate = req.body.startDate
    let endDate = req.body.endDate
    let status = req.body.report
    let query = { DateAdd: { $gte: startDate, $lte: endDate } };

    // เช็คว่า status มีค่าหรือไม่ ถ้ามีให้เพิ่มเงื่อนไขในการค้นหา
    if (status) {
        query.Status = status;
    }

    Device.find(query)
        .populate('CategoryID')
        .exec((err, devices) => {
            if (err) {
                console.error(err);
                return;
            }
            // โหลดไฟล์ EJS และสร้าง HTML จากข้อมูล
            ejs.renderFile('./views/report/devices.ejs', { devices }, (err, html) => {
                if (err) {
                    console.log(err);
                    return;
                }

                // ตั้งค่าสำหรับการสร้าง PDF
                const options = { format: 'A4' };

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

module.exports = router