const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DescendentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    info: String,
})

module.exports = mongoose.model('Descendent', DescendentSchema)