const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RelationshipSchema = new Schema({
    parentId: {
        type: String,
        required: true
    },
    childId: {
        type: String,
    },
    spouseId: {
        type: String
    }
})

module.exports = mongoose.model('Relationship', RelationshipSchema)