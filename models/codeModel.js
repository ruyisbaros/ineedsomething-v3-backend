const mongoose = require("mongoose")
const { ObjectId } = mongoose.Types

const codeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    }
})

const Code = mongoose.model("Code", codeSchema)

module.exports = Code