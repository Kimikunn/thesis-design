const mongoose = require('mongoose')

const CodeSchema = mongoose.Schema({
    email:
    {
        type: String,
        required: true
    },
    code:
    {
        type: String,
        required: true
    },
    date:
    {
        type: Date,
        default: Date.now
    }
})

const Code = mongoose.model('Code', CodeSchema)

module.exports = Code