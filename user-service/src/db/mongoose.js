const { mongo } = require('mongoose')
const mongoose = require('mongoose')
const validator = require('validator')

console.log(process.env.MONGODB_URL);
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
