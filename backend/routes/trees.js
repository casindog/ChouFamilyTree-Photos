const express = require("express");
const router = express.Router();
const Tree = require('../models/Tree')

router.get('/', (req,res) => {
    Tree.find()
        .then(trees => res.json(trees));
})

router.post('/', (req, res) => {
    let newTree = new Tree({
        personId: req.body.personId,
        name: req.body.name,
        children: req.body.child
    })
    
    newTree.save()
})

router.patch('/:id', (req, res) => {
    console.log(`treeId: ${req.params.id}`)
    console.log(`parentId: ${req.body.parentId}`)
    console.log(`childData: ${req.body.child}`)

    Tree.findById(req.params.id, (err, tree) => {
        if (!tree) {
            res.status(404).send("tree not found");
        } else {

            dfs(tree,req.body.parentId)

            // markModified saved my life.
            tree.markModified('children')
            tree.save()
                .then(() => res.send(tree))
                .catch(err => res.status('404').send(err))
        }
    })

    function dfs(tree, id) {
        if (tree.personId === id) {
            console.log('found parent, push child into array')
       
            let child = {
                personId: req.body.child._id,
                name: req.body.child.name,
                children: []
            }

            tree.children.push(child)

            return
        }
    
        for (let c of tree.children) {
            dfs(c, id)
        }

        return tree
    }
})



module.exports = router;
