const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("codeAndURL", schema)
