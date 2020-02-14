const express = require("express");
const router = express.Router();
const Tree = require('../models/Tree')

router.get('/', (req,res) => {
    Tree.find()
        .then(trees => res.json(trees));

})

module.exports = router;
