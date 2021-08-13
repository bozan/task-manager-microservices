const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
// const { sendWelcomeEmail, cancelationEmail} =  require('../emails/account') 
const router = new express.Router()

// Authentication token validation
router.get('/users/auth/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);

        console.log(user);

        if (!user) {
            res.status(404).send({ error: 'User not found' });
        }
        // const user = req.params.id;
        res.send({ user });
    } catch (e) { console.log(e) }
})

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id)

//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)

//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

// CREATE A USER
router.post('/users', async (req, res) => {
    const new_user = new User(req.body)

    try {
        // sendWelcomeEmail(new_user.email, new_user.name)
        const token = jwt.sign({ _id: new_user._id.toString() }, process.env.JWT_SECRET)
        new_user.tokens = new_user.tokens.concat({ token })
        await new_user.save()
        res.status(201).send({new_user, token})

    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
        user.tokens = user.tokens.concat({ token })
        await user.save()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send('Logged out successfully')
    } catch (e) {
        res.status(500).send(e)
    }
})


router.post('/users/logoutAll', auth, async (req, res) => {

    try {
        req.user.tokens = []
        await req.user.save()

        res.send('Logged out from all session successfully')
    } catch (e) {
        res.status(500).send(e)
    }
})

// GET ALL USERS
router.get('/users/me', auth, async (req, res) => { // (route, middleware function, route handler)
    res.send(req.user)      
})

// UPDATE A USER BY ID
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({'Error': 'invalid updates! '})
    }
    
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)

    } catch (e) {
        res.status(400).send(e) // validation error 
    }
})

// DELETE A USER BY ID
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        // cancelationEmail(req.user.email, req.user.name)
        res.send(req.user)

    } catch (e) {
        res.status(500).send(e)
    }
})

// UPLOAD A PROFILE PICTURE
const upload = multer({
    limits: {
        fileSize: 1000000 // 1MB limit
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload jpg, jpeg or png file'))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height:250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message})
})

// DELETE A IMAGE
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send(req.user)
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error('Not found!')
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send(e)
    }
})

module.exports = router;
