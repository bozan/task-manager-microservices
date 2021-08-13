const jwt = require('jsonwebtoken')
const mongoose =  require('mongoose')
const User = require('../..//src/models/user')
const Task = require('../../src/models/task')

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

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "First task ",
    completed: false,
    owner: UserOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Second task ",
    completed: true,
    owner: UserOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "Third task ",
    completed: true,
    owner: UserTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()

    await new User(UserOne).save()
    await new User(UserTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    UserOne,
    userTwoId,
    UserTwo,
    setupDatabase,
    taskOne,
    taskTwo,
    taskThree
}