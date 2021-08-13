const jwt = require('jsonwebtoken')
const {userCaller, userCallerAxios} = require('../callers/user-service');
// const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // call api request

        // const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        const user = await userCallerAxios({ _id: decoded._id, token });
        // const user = userCaller({_id: decoded._id, token}, (error, response) => {

        // });

        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({error: 'please authenticate'})
    }
}
module.exports = auth
