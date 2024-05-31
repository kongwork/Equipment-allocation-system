const express = require("express")
const router = express.Router()
const bcrypt = require('bcryptjs');
const User = require("../../../models/user")

// อัพโหลดไฟล์รูปภาพ
const multer = require("multer")
const user_img = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploadsIMG/user"); //ตำแหน่งเก็บไฟล์
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + ".jpg"); //เปลี่ยนชื่อไฟล์ ้ป้องกันชื่อไฟล์ซ้ำกัน
    },
});

const upload = multer({ storage: user_img })

router.post("/InsertUser", upload.single("image"), (req, res) => {
    const username = req.body.UserName;
    User.findOne({ UserName: username }).exec((err, doc) => {
        if (doc) {
            return res.redirect("/user");
        }
        const saltRounds = 10; // จำนวนรอบในการสร้าง salt
        bcrypt.hash(req.body.Password, saltRounds, (err, hash) => {
            if (err) {
                console.error(err);
                return;
            }
            const userData = {
                Prefix: req.body.Prefix,
                FirstName: req.body.FirstName,
                LastName: req.body.LastName,
                UserName: req.body.UserName,
                Email: req.body.Email,
                PhoneNumber: req.body.PhoneNumber,
                Password: hash, // รหัสผ่านที่ถูกแฮชแล้ว
                TypeUser: req.body.TypeUser,
                UserImg: req.file ? req.file.filename : null
            };

            const data = new User(userData);
            User.saveUser(data, (err) => {
                if (err) console.log(err);
                res.redirect("/user");
            });
        });
    });
});

module.exports = router