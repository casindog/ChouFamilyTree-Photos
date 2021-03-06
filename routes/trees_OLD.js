const express = require("express");
const router = express.Router();

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
    Tree.findById(req.params.id, (err, tree) => {
        if (!tree) {
            res.status(404).send("tree not found");
        } else {
            dfs(tree, req.body.parentId, req)
            
            // markModified saved my life.
            tree.markModified('children')
            tree.save()
                .then(() => res.send(tree))
                .catch(err => res.status('404').send(err))
        }
    })

    function dfs(tree, id) {
        if (tree.personId === id) {
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
    }
})

router.delete('/:treeId', (req, res) => {
    let deleteId = req.body.personId

    Tree.findById(req.params.treeId, (err, tree) => {
        if (!tree) {
            res.status(404).send("tree not found");
        } else {
            dfs(tree)

            // markModified saved my life.
            tree.markModified('children')
            tree.save()
                .then(() => res.send(tree))
                .catch(err => res.status('404').send(err))
        }
    })

    function dfs(node) {
        for (let i=0; i<node.children.length; i++) {
            if (node.children[i].personId===deleteId) {
                node.children.splice(i,1)
                return
            }
            dfs(node.children[i])
        }
    }
})




module.exports = router;
