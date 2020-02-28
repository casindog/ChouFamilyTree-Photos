console.log(`mongoURI should be: ${process.env.MONGO_URI}`)

module.exports = {
    // don't know why process.env is undefined
    mongoURI: process.env.MONGO_URI
    // this works.
    // mongoURI: "mongodb+srv://dev:EIheXG84cqAP6INj@cluster0-0jesq.mongodb.net/test?retryWrites=true&w=majority"
}