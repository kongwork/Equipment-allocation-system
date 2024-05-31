const express = require("express")
const Device = require("../../../models/device")
const Category = require("../../../models/category")
const router = express.Router()

router.get("/device", (req, res) => {
    const showname = req.session.username
    if (req.session.login) {
        Device.find().exec((err, device) => {
            Category.find().exec((err, category) => {
                if (req.cookies.AddOrderFail) {
                    res.render("device", {
                        type_user: req.session.typeUser,
                        AddOrderFail: true,
                        devices: device,
                        categorys: category,
                        order: 1,
                        showname: showname,
                        today: new Date(),
                        date: new Date()
                    })
                }
                else {
                    res.render("device", {
                        type_user: req.session.typeUser,
                        AddOrderFail: false,
                        devices: device,
                        categorys: category,
                        order: 1,
                        showname: showname,
                        today: new Date(),
                        date: new Date()
                    })
                }
            })
        })
        //แสดงผลหน้า Template <%= JSON.stringify(item.details,[ 'details', 'CategoryName']).slice(18,-3); %>
        /*let MongoClient = require('mongodb').MongoClient;
        let url = "mongodb://localhost:27017/";

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            dbo.collection('devices').aggregate([
                {
                    $lookup:
                    {
                        from: 'categorys',
                        localField: 'CategoryID',
                        foreignField: '_id',
                        as: 'details'
                    }
                }
            ]).toArray(function (err, doc) {
                if (err) throw err;
                res.render("device", { devices: doc, order: order, showname: showname })
                console.log(JSON.stringify(res, ['_id', 'details', 'CategoryName']));
                db.close();
            });
        });*/
    }
    else {
        res.redirect('/')
    }
})

module.exports = router