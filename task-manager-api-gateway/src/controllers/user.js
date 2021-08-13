const express = require('express')
const router = express.Router()
const axios = require('axios');

const apiAdapter = (baseURL) => axios.create({ baseURL });

const USER_SERVICE_URL = 'http://localhost:3000';
const api = apiAdapter(USER_SERVICE_URL);

router.get('/', (req, res) => {
    res.send('Simple API Gateway')
})

router.post('/users', async (req, res) => {
    try {
        const response = await api.post(req.path, req.body);
        res.send(response.data);
    }
    catch (e) {
        res.status(502).send(e);
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const response = await api.post(req.path, req.body);
        res.send(response.data);
    }
    catch (e) {
        res.status(502).send(e);
    }
})

router.post('/users/logout', async (req, res) => {
    try {
        const response = await api.post(req.path, req.body, { headers: req.headers });
        res.send(response.data);
    }
    catch (e) {
        res.status(502).send(e);
    }
})

router.post('/users/logoutAll', async (req, res) => {
    try {
        const response = await api.post(req.path, req.body, { headers: req.headers });
        res.send(response.data);
    }
    catch (e) {
        res.status(502).send(e);
    }
})

router.get('/users/me', async (req, res) => {
    try {
        const response = await api.get(req.path, { headers: req.headers });
        res.send(response.data)      
    } catch (e) {
        res.status(502).send(e)
    }
})

router.patch('/users/me', async (req, res) => {
    try {
        const response = await api.patch(req.path, req.body, { headers: req.headers });
        res.send(response.data);
    }
    catch (e) {
        res.status(502).send(e);
    }
})

router.delete('/users/me', async (req, res) => {
    try {
        const response = await api.delete(req.path, { headers: req.headers });
        res.send(response.data)
    } catch (e) {
        res.status(500).send(e)
    }
})
const multer = require('multer')
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

router.post('/users/me/avatar', upload.single('avatar'), async (req, res) => {
    try {
        console.log('deneme')
        console.log(req.file);
        const response = await api.post(
            req.path,
            { headers: req.headers },
            { data: req.body }
        );
        res.send(response.data);
    }
    catch (e) {
        res.status(502).send(e);
    }
})

router.delete('/users/me/avatar', async (req, res) => {
    try {
        const response = await api.delete(req.path, { headers: req.headers });
        res.send(response.data);
    } catch (e) {
        res.status(502).send(e);
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const response = await api.get(req.path);
        res.send(response.data);
    } catch (e) {
        res.status(502).send(e);
    }
})

module.exports = router;
