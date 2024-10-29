import express from 'express'
import cookieParser from 'cookie-parser'

import { loggerService } from './services/logger.service.js'
import { todoService } from './services/todo.service.js'
import { userService } from './services/user.service.js'

const app = express()
const PORT = process.env.PORT || 3030

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/api/todo', (req, res) => {
    const filterBy = req.query
    console.log(filterBy)
    todoService.query(filterBy)
        .then(todos => res.send(todos))
        .catch(err => loggerService.error('Cant load todos' + err))
})

app.get('/api/todo/:todoId', (req, res) => {
    const { todoId } = req.params
    todoService.getById(todoId)
        .then(bug => {
            return bug
        })
        .then(bug => res.send(bug))
        .catch(err => loggerService.error('Cant get bug' + err))
})

app.post('/api/todo', (req, res) => {
    const { txt, importance, isDone } = req.body
    const todoToSave = { txt, importance, isDone }
    console.log(todoToSave)
    todoService.save(todoToSave)
        .then(todo => res.send(todo))
        .catch(err => loggerService.error('Cant save todo' + err))
})

app.put('/api/todo', (req, res) => {
    console.log(req.body)
    const { _id, txt, importance, isDone, backgroundColor } = req.body
    const todoToSave = { _id, txt, importance, isDone, backgroundColor }
    todoService.save(todoToSave)
        .then(todo => res.send(todo))
        .catch(err => {
            res.status(401).send('Cannot edit todo ' + err)
            loggerService.error('Cant save todo ' + err)
        })
})

app.delete('/api/todo/:todoId', (req, res) => {
    const { todoId } = req.params
    todoService.remove(todoId)
        .then(() => res.send(`Bug ${todoId} removed`))
        .catch(err => loggerService.error('Cant remove bug' + err))
})

app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => {
            res.send(users)
        }).catch(err => loggerService.error('Cant load users' + err))
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.getById(userId)
        .then(user => {
            res.send(user)
        }).catch(err => loggerService.error('Cant load user' + err))
})
// USER AUTH

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

app.listen(PORT, () =>
    loggerService.info(`Server is ready on http://127.0.0.1:${PORT}/`))