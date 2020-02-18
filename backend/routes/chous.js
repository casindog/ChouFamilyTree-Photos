const express = require("express");
const router = express.Router();
const Chou = require('../models/Chou')
const Tree = require('../models/Tree')

router.post('/', (req,res) => {
    let newChou = new Chou({
        name: req.body.name,
        info: req.body.info
    })

    newChou.save()
        .then(() => {
            res.send({data: newChou})
        })
        .catch(err => {
            return res.status(500).send(err)
        })
})

router.patch('/', (req, res) => {

})

module.exports = router;
