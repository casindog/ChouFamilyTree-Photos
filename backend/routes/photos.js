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

            res.json({name: filename, path: `/uploads/${filename}`})
        })
        .catch(err => {
            console.log(err)
            return res.status(500).send(err)
        })
}) 

router.patch('/:photoId', (req, res) => {
    let photoId = req.params.photoId
    console.log(photoId)
    // var query = { campaign_id: new ObjectId(campaign._id) };
    let photo = Photo.findById(photoId, (err, photo) => {
        if (!photo) { 
            res.status(404).send("photo not found");
        } else {
            photo.persons.push(req.body.test)
            photo.save()
                .then(() => {
                    res.json({tags: photo.persons})
                })
        }
    })
    console.log(photo)
    console.log(photo.persons)
    // console.log(req.body.test_chou)
    // photo.persons.push('test')

    // photo.save()
    //     .then(() => {
    //         res.json({msg: 'LOKTAR'})
    //     })
    //     .catch(err => {
    //         res.json({msg: 'failed'})
    //     })

})

module.exports = router;
