const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const mongoose = require('mongoose');
const router = new express.Router()

// CREATE A TASK
router.post('/tasks', auth, async (req, res) => {
    const new_task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await new_task.save()
        res.status(201).send(new_task)

    } catch (e) {
        res.status(400).send(e)
    } 
})

// GET ALL TASKS
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:asc or /tasks?sortBy=createdAt:desc

router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    console.log(req.query.limit);
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] == 'desc' ? -1 : 1
    }
    try {
        const tasks = await Task.find({
            owner: req.user._id,
            ...match
        })
            .limit(parseInt(req.query.limit))
            .skip(parseInt(req.query.skip))
            .sort(sort);
        res.send(tasks);

} catch (e) {
    console.log(e);
    res.status(500).send(e)
}
})

// GET A TASK BY ID
router.get('/tasks/:id', auth, async (req, res) => {
const _id = req.params.id
try {
    const task = await Task.findOne({_id: _id, owner: req.user._id})

    if (!task) {
        return res.status(404).send()
    }
    res.send(task)
} catch (e) {
    res.status(500).send(e.message)
}
})
// UPDATE A TASK BY ID 
router.patch('/tasks/:id', auth, async (req, res) => {
const updates = Object.keys(req.body)
const allowedUpdates = ['description', 'completed']
const isValidOperation = updates.every((update) =>  allowedUpdates.includes(update))
if (!isValidOperation) {
    return res.status(400).send({'Error ':'invalid updates!'})
}
try {
    const _task = await Task.findOne({_id: req.params.id, owner: req.user._id})

    if (!_task) {
        return res.status(404).send()
    }
    updates.forEach((update) => _task[update] = req.body[update])
    await _task.save()
    return res.send(_task)

} catch (e) {
    res.status(400).send(e) // validation error
}
})
// DELETE A TASK BY ID
router.delete('/tasks/:id', auth, async (req, res) => {
try {
    const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
    if (!task) {
        return res.status(404).send()
    }
    res.send(task)

} catch (e) {
    res.status(500).send(e)
}
})

module.exports = router;
