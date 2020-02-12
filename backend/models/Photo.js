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

const Photo = mongoose.model('Photo', PhotoSchema);
module.exports = Photo;