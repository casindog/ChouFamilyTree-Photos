const express = require("express");
const router = express.Router();
const Photo = require('../models/Photo')

router.post('/', (req, res) => {
    if (req.files === null) {
        return res.status(400).json({
            msg: 'No file uploaded'
        })
    }

    // .file is dependent on frontend property name
    const file = req.files.file
    let filename = file.name
    let arr = filename.split('.')
    let [base, ext] = arr
    let time = Date.now()

    filename = `${base}-${time}.${ext}`
    console.log(filename)


    let newPhoto = new Photo({
        name: filename
    })


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

module.exports = router;
