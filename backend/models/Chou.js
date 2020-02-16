const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChouSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    info: {
        type: String
    },
    children: {
        type: Array
    }
})

const Chou = mongoose.model('Chou', ChouSchema);
module.exports = Chou;