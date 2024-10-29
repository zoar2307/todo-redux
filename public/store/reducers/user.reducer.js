import { userService } from "../../services/user.service.js"


export const SET_USER = 'SET_USER'
export const SET_USER_BALANCE = 'SET_USER_BALANCE'

const initialState = {
    loggedinUser: userService.getLoggedinUser(),
}

export function userReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        case SET_USER:
            return {
                ...state,
                loggedinUser: cmd.user
            }
        case SET_USER_BALANCE:
            return {
                ...state,
                loggedinUser: { ...state.loggedinUser, balance: cmd.balance }

            }
        default: return state
    }
}
