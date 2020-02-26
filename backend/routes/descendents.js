const express = require("express");
const router = express.Router();
const Descendent = require('../models/Descendent')

router.post('/', (req,res) => {
    let descendent = new Descendent({
        name: req.body.name,
        info: req.body.info
    })

    descendent.save()
        .then(() => res.send(descendent))
})

router.patch('/', (req,res) => {
    if (req.body.action==='add'){
        Descendent.findById(req.body.parentId, (err, d) => {
            d.children.push(req.body.childId)
            d.save()
                .then(() => res.send(d))

        })
    } else if (req.body.action==='del') {
        Descendent.findById(req.body.parentId, (err, parent) => {
            parent.children = parent.children.filter(child => child !== req.body.childId)
            parent.save()
                .then(() => res.send(parent))
        })
    }
})

router.delete('/:id', (req,res) => {
    Descendent.findById(req.params.id, (err, descendent) => {
        descendent.remove()
            .then(() => res.send('person deleted'))
    })
})

module.exports = router;
