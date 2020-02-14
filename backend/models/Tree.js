const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TreeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    children: {
        type: Array
    }
})

const Tree = mongoose.model('trees', TreeSchema);
module.exports = Tree;