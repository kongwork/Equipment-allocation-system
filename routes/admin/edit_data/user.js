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

router.post("/EditUser", upload.single("image"), async (req, res) => {
    const update_user = req.body.user_id;
    let data = {
        Prefix: req.body.Prefix,
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        UserName: req.body.UserName,
        Email: req.body.Email,
        PhoneNumber: req.body.PhoneNumber,
        TypeUser: req.body.TypeUser
    };

    if (req.file) {
        data.UserImg = req.file.filename;
    }

    if (req.body.Password) {
        const hashedPassword = await bcrypt.hash(req.body.Password, 10);
        data.Password = hashedPassword;
    }

    User.findByIdAndUpdate(update_user, data, { useFindAndModify: false }, (err) => {
        if (err) {
            console.error(err);
        } else {
            res.redirect("/user");
        }
    });
});
/*router.post("/EditUser",upload.single("image"),(req, res) => {
    const update_user = req.body.user_id
    if(!req.file){
        let data = {
            Prefix: req.body.Prefix,
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            UserName: req.body.UserName,
            Email: req.body.Email,
            PhoneNumber: req.body.PhoneNumber,
            Password: req.body.Password,
            TypeUser: req.body.TypeUser
        }
        User.findByIdAndUpdate(update_user, data, { useFindAndModify: false }).exec(err => {
            res.redirect("/user")
        })
    }
    else{
        let data = {
            Prefix: req.body.Prefix,
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            UserName: req.body.UserName,
            Email: req.body.Email,
            PhoneNumber: req.body.PhoneNumber,
            Password: req.body.Password,
            TypeUser: req.body.TypeUser,
            UserImg: req.file.filename
        }
        User.findByIdAndUpdate(update_user, data, { useFindAndModify: false }).exec(err => {
            res.redirect("/user")
        })
        console.log(data)
    }
})*/

module.exports = router;