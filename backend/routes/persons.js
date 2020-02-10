const express = require("express");
const router = express.Router();
const Person = require('../models/Person')

router.get('/', (req,res) => {
    Person.find()
        .then(persons => res.json(persons));

})

module.exports = router;
