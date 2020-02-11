const mongoose = require('mongoose')
const express = require('express')
const app = express()
const db = require('./config/keys').mongoURI
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload')


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload())

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

// app.use('/uploads', express.static('uploads'));

const persons = require("./routes/persons");
const photos = require('./routes/photos')

app.use('/persons', persons);
app.use('/photos', photos)