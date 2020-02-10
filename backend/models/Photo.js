const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    
})

const Person = mongoose.model('persons', PersonSchema);
module.exports = Person;