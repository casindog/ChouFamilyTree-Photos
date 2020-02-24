const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TreeSchema = new Schema({
    personId: {
        type: String,
        required: true
    },
    // name: {
    //     type: String,
    //     required: true
    // },
    // spouse: {
    //     type: Array
    // },
    // children: {
    //     type: Array
    // }
})

const Tree = mongoose.model('trees', TreeSchema);
module.exports = Tree;