// use mongoose
const mongoose = require('mongoose');
const Category = require('./category');

// connect MongoDB
const dbUrl = "mongodb://localhost:27017/mydb"
mongoose.connect(dbUrl, {
    useNewUrlparser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err))

// design Schema
let deviceSchema = mongoose.Schema({
    DeviceID: String,
    CategoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'categorys' },
    DeviceName: String,
    DateAdd: Date,
    DateDispose: Date,
    Status: String,
    Type: String,
    DeviceImg: String
});

// create model
let Device = mongoose.model("devices", deviceSchema)

// export model
module.exports = Device

//for save data
module.exports.saveDevice = function (model, data) {
    model.save(data)
}