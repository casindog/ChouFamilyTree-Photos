const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    path: {
        type: String,
        required: true
    },
    persons: {
        type: Array
    }
})

module.exports = mongoose.model('Photo', PhotoSchema);