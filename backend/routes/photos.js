const express = require("express");
const router = express.Router();
const Photo = require('../models/Photo')
const path = require('path')

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) 
})

const upload = multer({ storage }).single()

router.post('/', (req, res) => {
    res.send('test')
}) 

module.exports = router;
