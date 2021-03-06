const mongoose = require('mongoose')
const express = require('express')
const app = express();
const db = require('./config/keys').mongoURI;
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload')
const graphqlHTTP = require('express-graphql')
const schema = require('./graphql/schema')
const cors = require('cors')

// heroku deployment
const path = require('path')

console.log(db) //mongoURI
console.log('---')
console.log("mongodb+srv://dev:EIheXG84cqAP6INj@cluster0-0jesq.mongodb.net/test?retryWrites=true&w=majority")
console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
  console.log('should be in heroku server')
  console.log(db) // is undefined

  app.use(express.static('frontend/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  })
}

// allow cross-origin requests
app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload())

// graphql
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

// app.use('/uploads', express.static('uploads'));

// const trees = require("./routes/trees");
const photos = require('./routes/photos')
const descendents = require('./routes/descendents')

// app.use('/trees', trees);
app.use('/photos', photos)
app.use('/descendents', descendents)
