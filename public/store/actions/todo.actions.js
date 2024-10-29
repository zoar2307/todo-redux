import { todoService } from "../../services/todo.service.js"
import { ADD_TODO, REMOVE_TODO, SET_IS_LOADING, SET_TODOS, UPDATE_TODO } from "../reducers/todo.reducer.js"
import { store } from "../store.js"

export function loadTodos(filterBy) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    return todoService.query(filterBy)
        .then(todos => {
            store.dispatch({ type: SET_TODOS, todos })
            return todos
        })
        .catch(err => {
            console.eror('err:', err)
            throw err
        })
        .finally(() => {
            store.dispatch({ type: SET_IS_LOADING, isLoading: false })
        })
}

export function removeTodo(todoId) {
    return todoService.remove(todoId)
        .then(() => {
            store.dispatch({ type: REMOVE_TODO, todoId })
        })
        .catch(err => {
            console.log('err:', err)
            throw err
        })

}

export function saveTodo(todoToSave) {
    const type = todoToSave._id ? UPDATE_TODO : ADD_TODO
    return todoService.save(todoToSave)
        .then((savedTodo) => {
            store.dispatch({ type, todo: savedTodo })
            return savedTodo
        })
        .catch(err => {
            console.log('err:', err)
            throw err

        })
}

