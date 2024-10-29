import { start } from "repl"
import { utilService } from "./util.service.js"
import fs from 'fs'


const todos = utilService.readJsonFile('./data/todos.json')

export const todoService = {
    query,
    getById,
    remove,
    save,
}

function query(filterBy) {
    return Promise.resolve(todos)
        .then(todos => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                todos = todos.filter(todo => regExp.test(todo.txt))
            }

            if (filterBy.importance) {
                todos = todos.filter(todo => todo.importance >= filterBy.importance)
            }

            if (filterBy.type) {
                const filterType = filterBy.type === 'active' ? false : true
                todos = todos.filter(todo => todo.isDone === filterType)
            }

            if (filterBy.sort) {
                if (filterBy.sort === 'txt') {
                    todos = todos.sort((a, b) => a.txt.localeCompare(b.txt));
                } else {
                    todos = todos.sort((a, b) => a.createdAt - b.createdAt);
                }
            }

            return todos
        })
}

function getById(todoId) {
    const selectTodo = todos.find(todo => todo._id === todoId)
    if (!selectTodo) return Promise.reject(`Cant find ${todoId}`)
    return Promise.resolve(selectTodo)
}

function remove(todoId) {
    const selectBugIdx = todos.findIndex(todo => todo._id === todoId)
    if (selectBugIdx < 0) return Promise.reject(`Cant find ${todoId}`)

    todos.splice(selectBugIdx, 1)
    return _saveTodosToFile()
}

function save(todoToSave) {
    if (todoToSave._id) {
        todoToSave.updatedAt = Date.now()
        const todoIdx = todos.findIndex(todo => todo._id === todoToSave._id)
        todos[todoIdx] = { ...todos[todoIdx], ...todoToSave }
    } else {
        todoToSave._id = utilService.makeId()
        todoToSave.createdAt = Date.now()
        todoToSave.backgroundColor = '#606b5b'
        todos.unshift(todoToSave)
    }

    return _saveTodosToFile()
        .then(() => {
            return todoToSave
        })
}


function _saveTodosToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(todos, null, 4)
        fs.writeFile('data/todos.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}
