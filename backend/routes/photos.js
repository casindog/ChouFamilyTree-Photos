const express = require("express");
const router = express.Router();
const Photo = require('../models/Photo')

router.get('/', (req,res) => {
    Photo.find()
        .then(photos => res.json(photos));
})

router.post('/', (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' })
    }

    // .file is dependent on frontend property name
    const file = req.files.file
    let filename = file.name
    let arr = filename.split('.')
    let [base, ext] = arr
    let time = Date.now()

    filename = `${base}-${time}.${ext}`

    let newPhoto = new Photo({ path: `/uploads/${filename}` })

    newPhoto.save()
        .then(() => {
            file.mv(`../frontend/public/uploads/${filename}`, err => {
                if (err) return res.status(500).send(err)
            })        

            // res.json({
            //     name: filename, 
            //     path: `/uploads/${filename}`,
            //     persons: []
            // })
            res.json(newPhoto)
        })
        .catch(err => {
            return res.status(500).send(err)
        })
}) 

router.patch('/:photoId', (req, res) => {
    let photoId = req.params.photoId

    Photo.findById(photoId, (err, photo) => {
        if (!photo) { 
            res.status(404).send("photo not found");
        } else {
            // we need another conditional block depending on type of patch request add or remove
            if (!req.body.type) {
                // req is to add one
                let set = new Set(), newArr = []
                photo.persons.forEach(person => set.add(person.personId))
                req.body.data.forEach(person => {
                    if (!set.has(person.personId)) {
                        newArr.push(person)
                    }
                    set.add(person.personId)
                })

                photo.persons = photo.persons.concat(newArr)
            } else {
                // req is to del one
                let deleteId = req.body.personId
                for (let i=0; i<photo.persons.length; i++) {
                    if (photo.persons[i].personId === deleteId) {
                        photo.persons.splice(i,1)
                    }
                }
            }

            photo.save()
                .then(() => {
                    res.json({tags: photo.persons})
                })
            
        }
    })
})

module.exports = router;
