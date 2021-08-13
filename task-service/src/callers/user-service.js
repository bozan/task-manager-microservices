const request = require('postman-request');
const axios = require('axios');

const userCallerAxios = async ({ _id, token }) => {
    try {
        const response = await axios.get(
            `http://localhost:3000/users/auth/${_id}`, {
                // params: {
                //     _id,
                // },
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
        });
        const { user } = response.data;
        return user;
    } catch (e) {
        console.log(e);
    }
}


const userCaller = ({ _id, token }, callback) => {

    const USER_SERVICE_URL = `http://localhost:3000/users/auth/${_id}`;

    request({ url: USER_SERVICE_URL, json: true }, (error, response) => {
        if (error) {
            callback(error, undefined)
        } else {
            callback(undefined, response.body)
        }
    });
}

module.exports = {userCallerAxios, userCaller };
