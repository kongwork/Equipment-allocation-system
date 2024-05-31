const express = require("express")
const router = express.Router()
const Device = require("../../../models/device")

// อัพโหลดไฟล์รูปภาพ
const multer = require("multer")
const user_img = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploadsIMG/devices"); //ตำแหน่งเก็บไฟล์
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + ".jpg"); //เปลี่ยนชื่อไฟล์ ้ป้องกันชื่อไฟล์ซ้ำกัน
    },
});

const upload = multer({ storage: user_img })

// Update Data Device
router.post("/EditDevice",upload.single("image"),(req, res) => {
    // ข้อมูลใหม่ที่ส่งมาจาก form edit
    let data = {
        DeviceName: req.body.device_name,
        CategoryID: req.body.category_id,
        DeviceImg: req.file ? req.file.filename : undefined
    }
    // อัพเดตข้อมูล Device
    Device.findByIdAndUpdate(req.body.device_id, data, { useFindAndModify: false }).exec(err => {
        res.redirect("/device")
    })
})

module.exports = router;