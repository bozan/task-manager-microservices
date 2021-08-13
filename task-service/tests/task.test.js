const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOneId, UserOne, setupDatabase , userTwoId, UserTwo, taskOne, taskTwo, taskThree} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${UserOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)
    const task =  await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should get all tasks of userOne', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${UserOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Second user should not delete a task of first user', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${UserTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskOne._id) // assert that task one is exists in databsae
    expect(task).not.toBeNull()
})