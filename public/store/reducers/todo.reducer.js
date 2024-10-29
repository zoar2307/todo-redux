export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const SET_IS_LOADING = 'SET_IS_LOADING'
export const SET_FILTER_BY = 'SET_FILTER_BY'

const initialState = {
    todos: [],
    isLoading: false,
    filterBy: {},
}

export function todoReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        case SET_TODOS:
            return { ...state, todos: cmd.todos }
        case REMOVE_TODO:
            return { ...state, todos: state.todos.filter(todo => todo._id !== cmd.todoId) }
        case ADD_TODO:
            return {
                ...state,
                todos: [...state.todos, cmd.todo],
            }
        case UPDATE_TODO:
            return {
                ...state,
                todos: state.todos.map(todo => (todo._id === cmd.todo._id) ? cmd.todo : todo)
            }
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: cmd.isLoading
            }
        case SET_FILTER_BY:
            return {
                ...state,
                filterBy: { ...state.filterBy, ...cmd.filterBy }
            }

        default: return state
    }
}
