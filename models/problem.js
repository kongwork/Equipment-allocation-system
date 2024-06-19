// use mongoose
const mongoose = require('mongoose')

// connect MongoDB
const dbUrl = "mongodb://localhost:27017/mydb"
mongoose.connect(dbUrl, {
    useNewUrlparser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err))

// design Schema
let problemSchema = mongoose.Schema({
    UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    ProblemName: String,
    ProblemDetail: String,
    ProblemSolving: String,
    Status: String
})

// create model
let Problem = mongoose.model("problems", problemSchema)

// export model
module.exports = Problem

//for save data
module.exports.saveProblem = function (model, data) {
    model.save(data)
}