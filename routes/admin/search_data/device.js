const express = require("express")
const router = express.Router()
const Device = require('../../../models/device')
const Category = require('../../../models/category')

router.post("/search-device", async (req, res) => {
    const showname = req.session.username;
    const input_search = req.body.search.trim();
    const category_id = req.body.categoryId;

    if (!input_search && !category_id) return res.redirect("/device");

    const filter = {};
    if (input_search) filter.DeviceID = { $regex: '^' + input_search, $options: 'i' };
    if (category_id) filter.CategoryID = category_id;

    try {
        const [device, category] = await Promise.all([
            Device.find(filter).exec(),
            Category.find().exec()
        ]);
        const AddOrderFail = req.cookies.AddOrderFail || false;

        res.render("device", {
            type_user: req.session.typeUser,
            AddOrderFail,
            devices: device || [],
            categorys: category,
            order: 1,
            showname,
            today: new Date(),
            date: new Date()
        });
    } catch (error) {
        console.error("Error:", error);
        res.redirect("/device");
    }
});

module.exports = router