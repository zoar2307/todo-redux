import { storageService } from "./async-storage.service.js"


export const userService = {
    getLoggedinUser,
    login,
    logout,
    signup,
    // getById,
    query,
    getEmptyCredentials,
    updateBalance
}
const STORAGE_KEY_LOGGEDIN = 'user'
const STORAGE_KEY = 'userDB'

const BASE_URL = '/api/user/'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'


function query() {
    return axios.get(BASE_URL)
        .then(res => res.data)
}

// function getById(userId) {
//     return storageService.get(STORAGE_KEY, userId)
// }

function login({ username, password }) {
    return axios.post('/api/auth/login', { username, password })
        .then(res => res.data)
        .then(user => {
            _setLoggedInUser(user)
            return user
        })
}

function signup({ username, password, fullname }) {
    return axios.post('/api/auth/signup', { username, password, fullname })
        .then(res => res.data)
        .then(user => {
            _setLoggedInUser(user)
            return user
        })
}

function logout() {
    return axios.post('/api/auth/logout')
        .then(() => {
            sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
        })
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function _setLoggedInUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname, balance: user.balance }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}


function getEmptyCredentials() {
    return {
        fullname: '',
        username: 'muki',
        password: 'muki1',

    }
}

function updateBalance(diff) {
    const loggedInUserId = getLoggedinUser()._id
    return userService.getById(loggedInUserId)
        .then(user => {
            user.balance += diff
            return storageService.put(STORAGE_KEY, user)

        })
        .then(user => {
            _setLoggedinUser(user)
            return user.balance
        })
}




// signup({username: 'muki', password: 'muki1', fullname: 'Muki Ja'})
// login({username: 'muki', password: 'muki1'})

// Data Model:
// const user = {
//     _id: "KAtTl",
//     username: "muki",
//     password: "muki1",
//     fullname: "Muki Ja",
//     createdAt: 1711490430252,
//     updatedAt: 1711490430999
// }