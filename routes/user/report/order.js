const express = require("express")
const router = express.Router()
const pdf = require('html-pdf')
const ejs = require('ejs')
const Device = require("../../../models/device")
const Order = require("../../../models/order")

const PDFDocument = require('pdfkit');
const fs = require('fs');

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

                const doc = new PDFDocument({ size: 'A4' });

                // ตั้งค่า HTTP Header เพื่อแสดง PDF ในเบราว์เซอร์
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'inline; filename=output.pdf');

                // เขียนข้อมูล PDF ลงใน HTTP Response
                doc.pipe(res);

                // ขนาดของหน้ากระดาษ
                const pageSize = {
                    width: doc.page.width,
                    height: doc.page.height
                };

                // ขนาดของรูปภาพ
                const imageSize = {
                    width: 120,
                    height: 120 // ปรับขนาดตามความต้องการ
                };

                // คำนวณตำแหน่ง x ที่ต้องใช้เพื่อจัดให้รูปอยู่กึ่งกลาง
                const xPosition = (pageSize.width - imageSize.width) / 2;

                // เพิ่มรูปภาพโดยใช้ตำแหน่ง x ที่คำนวณไว้
                doc.image('public/logo/j6.png', xPosition, 25, { width: imageSize.width });

                // ขึ้นบรรทัดใหม่
                doc.moveDown(6);

                // ใช้ฟอนต์ภาษาไทย
                doc.font('public/fonts/THSarabunNew Bold.ttf').fontSize(24).text('รายงานการขอใช้งานอุปกรณ์', {
                    align: 'center'
                });
                
                // Format the date to show only the date part
                const formattedDate = new Date(order.Date).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                doc.font('public/fonts/THSarabunNew Bold.ttf').fontSize(16).text('Date:', { continued: true });
                doc.font('public/fonts/THSarabunNew.ttf').fontSize(16).text(` ${formattedDate}`);

                doc.font('public/fonts/THSarabunNew Bold.ttf').fontSize(16).text('Receipt No:', { continued: true });
                doc.font('public/fonts/THSarabunNew.ttf').fontSize(16).text(` ${order.OrderID}`);

                doc.font('public/fonts/THSarabunNew Bold.ttf').fontSize(16).text('Name:', { continued: true });
                doc.font('public/fonts/THSarabunNew.ttf').fontSize(16).text(` ${order.UserID.Prefix} ${order.UserID.FirstName} ${order.UserID.LastName}`);

                // Table header
                const tableData = [
                    ['#', 'รหัสอุปกรณ์', 'ชื่ออุปกรณ์', 'ประเภท']
                ];

                let rowNumber = 1;

                // Add device data to tableData
                devices.forEach(device => {
                    tableData.push([
                        rowNumber++,
                        device.DeviceID.toString(),
                        device.DeviceName,
                        device.CategoryID ? device.CategoryID.CategoryName : ''
                    ]);
                });

                // ตั้งค่าตำแหน่งเริ่มต้นของตาราง
                const startX = 50;
                const startY = 265;

                // ขนาดของแต่ละเซลล์
                const cellPadding = 10;
                const cellHeight = 25;
                // กำหนดความกว้างของคอลัมน์
                const columnWidths = [20, 70, 280, 100]; // คอลัมน์ที่ 1, 2 และ 3 ตามลำดับ

                // คำนวณความกว้างรวมของตาราง
                const totalTableWidth = columnWidths.reduce((acc, width) => acc + width, 0);

                // คำนวณตำแหน่ง x เริ่มต้นของตาราง
                const xTablePosition = (pageSize.width - totalTableWidth) / 2;

                const drawTableHeader = (doc, yPosition) => {
                    // วาดสีพื้นหลังสำหรับหัวตาราง
                    doc.save();
                    doc.fillColor('#003a6c');
                    tableData[0].forEach((_, columnIndex) => {
                        const cellWidth = columnWidths[columnIndex];
                        const xPosition = xTablePosition + columnWidths.slice(0, columnIndex).reduce((acc, width) => acc + width, 0);
                        doc.rect(xPosition, yPosition, cellWidth, cellHeight).fill();
                    });
                    doc.restore();
    
                    // วาดส่วนหัวของตาราง
                    doc.font('public/fonts/THSarabunNew Bold.ttf').fontSize(14).fillColor('white');
                    tableData[0].forEach((header, columnIndex) => {
                        const cellWidth = columnWidths[columnIndex];
                        const xPosition = xTablePosition + columnWidths.slice(0, columnIndex).reduce((acc, width) => acc + width, 0);
                        doc.text(header, xPosition, yPosition + cellPadding / 2, { align: 'center', width: cellWidth });
                    });
                };

                drawTableHeader(doc, startY);

                // วาดข้อมูลในตาราง
            let yPosition = startY + cellHeight;

            for (let rowIndex = 1; rowIndex < tableData.length; rowIndex++) {
                const row = tableData[rowIndex];

                // คำนวณความสูงของแถวตามความยาวข้อความในแต่ละเซลล์
                let rowHeight = cellHeight;
                row.forEach((cell, columnIndex) => {
                    const cellWidth = columnWidths[columnIndex] - 2 * cellPadding;
                    const cellHeight = doc.heightOfString(cell, { width: cellWidth });
                    rowHeight = Math.max(rowHeight, cellHeight + 2 * cellPadding);
                });

                // ตรวจสอบว่าความสูงของแถวปัจจุบันเกินพื้นที่ที่เหลือในหน้าหรือไม่
                if (yPosition + rowHeight > pageSize.height - 50) {
                    doc.addPage();
                    yPosition = 50; // รีเซ็ต yPosition สำหรับหน้าใหม่
                    drawTableHeader(doc, yPosition); // วาดหัวตารางใหม่
                    yPosition += cellHeight; // ปรับ yPosition สำหรับข้อมูลแถวถัดไป
                }

                // วาดสีพื้นหลังสำหรับแถวสลับสี
                doc.save();
                doc.fillColor(rowIndex % 2 === 0 ? '#ffffff' : '#f0f0f0'); // สีขาวและสีเทา
                doc.rect(xTablePosition, yPosition, totalTableWidth, rowHeight).fill();
                doc.restore();

                row.forEach((cell, columnIndex) => {
                    const cellWidth = columnWidths[columnIndex];
                    const xPosition = xTablePosition + columnWidths.slice(0, columnIndex).reduce((acc, width) => acc + width, 0);

                    const align = [0, 1, 4].includes(columnIndex) ? 'center' : 'left'; // จัดชิดตรงกลางเมื่อเป็นคอลัมน์ที่ 1, 2, หรือ 4

                    // กำหนดฟอนต์ปกติ
                    doc.font('public/fonts/THSarabunNew.ttf').fontSize(14).fillColor('black');

                    doc.text(cell, xPosition + cellPadding, yPosition + cellPadding, { align: align, width: cellWidth - 2 * cellPadding });
                });

                yPosition += rowHeight;
            }

                // สิ้นสุดการเขียนเอกสาร
                doc.end();
            });
    });
})

module.exports = router