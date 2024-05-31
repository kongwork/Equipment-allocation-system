// use mongoose
const mongoose = require('mongoose')

// connect MongoDB
const dbUrl = "mongodb://localhost:27017/mydb"
mongoose.connect(dbUrl, {
    useNewUrlparser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err))

// design Schema
let categorySchema = mongoose.Schema({
    CategoryName: String
});

// create model
let Category = mongoose.model("categorys", categorySchema)

// export model
module.exports = Category

//for save data
module.exports.saveCategory = function (model, data) {
    model.save(data)
}