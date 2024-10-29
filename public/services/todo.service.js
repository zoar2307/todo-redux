import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import axios from 'axios'
import { todo } from 'node:test'

const TODO_KEY = 'todoDB'
const BASE_URL = '/api/todo/'

// _createTodos()

export const todoService = {
    query,
    get,
    remove,
    save,
    getEmptyTodo,
    getDefaultFilter,
    getFilterFromSearchParams,
    // getImportanceStats,
    getDoneTodos
}
// For Debug (easy access from console):
window.cs = todoService

function query(filterBy = getDefaultFilter()) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)

}

function get(todoId) {
    return axios.get(BASE_URL + todoId).then(res => res.data)
}

function remove(todoId) {
    return axios.delete(BASE_URL + todoId)
}

function save(todo) {
    if (todo._id) {
        // TODO - updatable fields
        return axios.put(BASE_URL, todo).then(res => res.data)
    } else {
        return axios.post(BASE_URL, todo).then(res => res.data)
    }
}

function getEmptyTodo(txt = '', importance = 5) {
    return { txt, importance, isDone: false }
}

function getDefaultFilter() {
    return { txt: '', importance: 0, type: '', sort: '' }
}

function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}
    for (const field in defaultFilter) {
        filterBy[field] = searchParams.get(field) || ''
    }
    return filterBy
}


// function getImportanceStats() {
//     return storageService.query(TODO_KEY)
//         .then(todos => {
//             const todoCountByImportanceMap = _getTodoCountByImportanceMap(todos)
//             const data = Object.keys(todoCountByImportanceMap).map(speedName => ({ title: speedName, value: todoCountByImportanceMap[speedName] }))
//             return data
//         })
// }


function getDoneTodos(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
        .then(todos => {
            const todoCountDoneTodosMap = _getDoneTodoCount(todos)
            const data = Object.keys(todoCountDoneTodosMap).map(speedName => ({ title: speedName, value: todoCountDoneTodosMap[speedName] }))
            return data
        })
}

// function _createTodos() {
//     let todos = utilService.loadFromStorage(TODO_KEY)
//     if (!todos || !todos.length) {
//         todos = []
//         const txts = ['Learn React', 'Master CSS', 'Practice Redux']
//         for (let i = 0; i < 20; i++) {
//             const txt = txts[utilService.getRandomIntInclusive(0, txts.length - 1)]
//             todos.push(_createTodo(txt + (i + 1), utilService.getRandomIntInclusive(1, 10)))
//         }
//         utilService.saveToStorage(TODO_KEY, todos)
//     }
// }

// function _createTodo(txt, importance) {
//     const todo = getEmptyTodo(txt, importance)
//     todo._id = utilService.makeId()
//     todo.createdAt = todo.updatedAt = Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24)
//     todo.backgroundColor = '#606b5b'
//     return todo
// }

// function _setNextPrevTodoId(todo) {
//     return storageService.query(TODO_KEY).then((todos) => {
//         const todoIdx = todos.findIndex((currTodo) => currTodo._id === todo._id)
//         const nextTodo = todos[todoIdx + 1] ? todos[todoIdx + 1] : todos[0]
//         const prevTodo = todos[todoIdx - 1] ? todos[todoIdx - 1] : todos[todos.length - 1]
//         todo.nextTodoId = nextTodo._id
//         todo.prevTodoId = prevTodo._id
//         return todo
//     })
// }

// function _getTodoCountByImportanceMap(todos) {
//     const todoCountByImportanceMap = todos.reduce((map, todo) => {
//         if (todo.importance < 3) map.low++
//         else if (todo.importance < 7) map.normal++
//         else map.urgent++
//         return map
//     }, { low: 0, normal: 0, urgent: 0 })
//     return todoCountByImportanceMap
// }

function _getDoneTodoCount(todos) {
    const todoCountByProgressMap = todos.reduce((map, todo) => {
        if (todo.isDone) map.done++
        return map
    }, { done: 0 })
    return todoCountByProgressMap
}


// Data Model:
// const todo = {
//     _id: "gZ6Nvy",
//     txt: "Master Redux",
//     importance: 9,
//     isDone: false,
//     createdAt: 1711472269690,
//     updatedAt: 1711472269690
// }

