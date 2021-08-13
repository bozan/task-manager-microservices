const jwt = require('jsonwebtoken')
const mongoose =  require('mongoose')
const User = require('../../src/models/user')
const userOneId = new mongoose.Types.ObjectId()
const UserOne = {
    _id: userOneId,
    name: "beyza",
    email: "beyzaozan21@gmail.com",
    password: "beyza12345",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}


const userTwoId = new mongoose.Types.ObjectId()
const UserTwo = {
    _id: userTwoId,
    name: "sena",
    email: "senatimur1@gmail.com",
    password: "sena12345",
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const setupDatabase = async () => {
    await User.deleteMany()

    await new User(UserOne).save()
    await new User(UserTwo).save()
}

module.exports = {
    userOneId,
    UserOne,
    userTwoId,
    UserTwo,
    setupDatabase,
}