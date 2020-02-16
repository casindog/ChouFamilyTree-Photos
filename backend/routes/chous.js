const express = require("express");
const router = express.Router();
const Chou = require('../models/Chou')
const Tree = require('../models/Tree')

router.post('/', (req,res) => {
    let newChou = new Chou({
        name: req.body.name,
        info: req.body.info,
        child: req.body.child
    })

    let newTree = new Tree({
        name: req.body.name,
        info: req.body.info,
        child: []
    })

    newChou.save()
        .then(() => {
            newTree.save() // we need to update the tree
        })
        .then(() => res.json(newTree))
        .catch(err => {
            console.log(err)
            return res.status(500).send(err)
        })

})

router.patch('/', (req, res) => {

})

module.exports = router;
