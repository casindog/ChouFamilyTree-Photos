const mongoose = require('mongoose')
const express = require('express')
const app = express()
const db = require('./config/keys').mongoURI
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload')

const graphqlHTTP = require('express-graphql')
const schema = require('./graphql/schema')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload())

// graphql
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

// app.use('/uploads', express.static('uploads'));

const trees = require("./routes/trees");
const photos = require('./routes/photos')
const chous = require('./routes/chous')

app.use('/trees', trees);
app.use('/photos', photos)
app.use('/chous', chous)