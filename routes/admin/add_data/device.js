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

function generateUniqueID() {
    let id = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const idLength = 5;

    for (let i = 0; i < idLength; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return id;
}

router.post("/addDevice", upload.single("image"), (req, res) => {
    const data = new Device({
        DeviceID: generateUniqueID(),
        CategoryID: req.body.category_id,
        DeviceName: req.body.device_name,
        DateAdd: req.body.date,
        Type: req.body.type,
        Status: '00',
        DeviceImg: req.file ? req.file.filename : undefined
    });

    Device.saveDevice(data, (err) => {
        if (err) console.log(err);
        res.redirect("/device");
    });
});


router.post("/insertDevice",upload.single("image"),(req, res) => {
    if(!req.file){
        let data = new Device({
            DeviceID: generateUniqueID(),
            CategoryID: req.body.category_id,
            DeviceName: req.body.device_name,
            DateAdd: req.body.date,
            Type: req.body.type,
            Status: '00'
        })
    }
    else{
        let data = new Device({
            DeviceID: generateUniqueID(),
            CategoryID: req.body.category_id,
            DeviceName: req.body.device_name,
            DateAdd: req.body.date,
            Type: req.body.type,
            Status: '00',
            DeviceImg: req.file.filename
        })
    }
    Device.saveDevice(data, (err) => {
        if (err) console.log(err)
        res.redirect("/device")
    })
})

module.exports = router