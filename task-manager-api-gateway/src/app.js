const express = require('express');

const userAPIGateway = require('./controllers/user')
const taskAPIGateway =  require('./controllers/task')

const app = express()
  .use(express.json())
  .use(userAPIGateway)
  .use(taskAPIGateway);

module.exports = app;
