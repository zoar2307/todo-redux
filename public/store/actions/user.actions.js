import { userService } from "../../services/user.service.js"
import { SET_USER, SET_USER_BALANCE } from "../reducers/user.reducer.js"
import { store } from "../store.js"



export function login(credentials) {
    return userService.login(credentials)
        .then(user => {
            store.dispatch({ type: SET_USER, user })
        })
        .catch(err => {
            console.log('User actions -> Cannot login:', err)
            throw err
        })
}

export function signup(credentials) {
    return userService.signup(credentials)
        .then(user => {
            store.dispatch({ type: SET_USER, user })
        })
        .catch(err => {
            console.log('User actions -> Cannot signup:', err)
            throw err
        })
}

export function logout() {
    return userService.logout().then(() => {
        store.dispatch({ type: SET_USER, user: null })
    })
}

export function updateBalance(diff) {
    return userService.updateBalance(diff)
        .then(newBalance => {
            store.dispatch({ type: SET_USER_BALANCE, balance: newBalance })
        })
        .catch(err => {
            console.log('User actions -> Cannot checkout:', err)
            throw err
        })
}
