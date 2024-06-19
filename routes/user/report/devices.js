const express = require("express");
const router = express.Router();
const Device = require("../../../models/device");
const PDFDocument = require('pdfkit');

router.post("/report-devices", (req, res) => {
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let status = req.body.report;
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
                return res.status(500).send("Internal Server Error");
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
            doc.font('public/fonts/THSarabunNew Bold.ttf').fontSize(24).text('รายงานข้อมูลอุปกรณ์', {
                align: 'center'
            });

            // Table header
            const tableData = [
                ['#', 'รหัสอุปกรณ์', 'ชื่ออุปกรณ์', 'ประเภท', 'สถานะอุปกรณ์', 'วันที่เพิ่ม', 'วันที่จำหน่าย']
            ];

            let rowNumber = 1;

            // Add device data to tableData
            devices.forEach(device => {
                let statusText = '';

                switch (device.Status) {
                    case '00':
                        statusText = 'ไม่ได้ใช้งาน';
                        break;
                    case '01':
                        statusText = 'เลิกใช้งาน';
                        break;
                    case '02':
                        statusText = 'กำลังทำรายการ';
                        break;
                    case '03':
                        statusText = 'กำลังใช้งาน';
                        break;
                    default:
                        statusText = 'ไม่ระบุสถานะ';
                }

                let formattedDateAdd = device.DateAdd ? new Date(device.DateAdd).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }) : '';

                let formattedDateDispose = device.DateDispose ? new Date(device.DateDispose).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }) : '';

                tableData.push([
                    rowNumber++,
                    device.DeviceID.toString(),
                    device.DeviceName,
                    device.CategoryID ? device.CategoryID.CategoryName : '',
                    statusText,
                    formattedDateAdd,
                    formattedDateDispose
                ]);
            });

            // ตั้งค่าตำแหน่งเริ่มต้นของตาราง
            const startX = 50;
            let startY = 215;

            // ขนาดของแต่ละเซลล์
            const cellPadding = 10;
            const cellHeight = 25;
            // กำหนดความกว้างของคอลัมน์
            const columnWidths = [20, 70, 130, 80, 75, 75, 75]; // คอลัมน์ที่ 1, 2 และ 3 ตามลำดับ

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

                    const align = [0, 1, 3, 4, 5, 6].includes(columnIndex) ? 'center' : 'left'; // จัดชิดตรงกลางเมื่อเป็นคอลัมน์ที่ 1, 2, หรือ 4

                    // เช็คสถานะและกำหนดสีข้อความ
                    if (columnIndex === 4 && cell === 'เลิกใช้งาน') {
                        doc.fillColor('red'); // กำหนดสีเป็นสีแดง
                    } else {
                        doc.fillColor('black'); // กำหนดสีเป็นสีดำ
                    }

                    // กำหนดฟอนต์ปกติ
                    doc.font('public/fonts/THSarabunNew.ttf').fontSize(14);

                    doc.text(cell, xPosition + cellPadding, yPosition + cellPadding, { align: align, width: cellWidth - 2 * cellPadding });

                    // กำหนดสีข้อความกลับเป็นสีดำหลังจากวาดเสร็จแล้ว
                    doc.fillColor('black');
                });

                yPosition += rowHeight;
            }

            // สิ้นสุดการเขียนเอกสาร
            doc.end();
        });
});

module.exports = router;