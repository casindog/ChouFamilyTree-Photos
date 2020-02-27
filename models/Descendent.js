const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DescendentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    info: String,
    children: {
        type: Array
    }, 
    spouse: { 
        type: Array
    }
})

module.exports = mongoose.model('Descendent', DescendentSchema)