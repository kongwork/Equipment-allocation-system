// use mongoose
const mongoose = require('mongoose')

// connect MongoDB
const dbUrl = "mongodb://localhost:27017/mydb"
mongoose.connect(dbUrl, {
    useNewUrlparser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err))

// design Schema
let orderSchema = mongoose.Schema({
    OrderID: String,
    UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    DeviceID: [{type: mongoose.Schema.Types.ObjectId, ref: 'devices'}],
    Date: Date,
    Status: String
});

// create model
let Order = mongoose.model("order", orderSchema)

// export model
module.exports = Order

//for save data
module.exports.saveOrder = function (model, data) {
    model.save(data)
}