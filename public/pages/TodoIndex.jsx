import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadTodos, removeTodo, saveTodo } from "../store/actions/todo.actions.js"
import { updateBalance } from "../store/actions/user.actions.js"
import { SET_FILTER_BY } from "../store/reducers/todo.reducer.js"
import { TodoSort } from "../cmps/TodoSort.jsx"

const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM
const { useSelector, useDispatch } = ReactRedux

export function TodoIndex() {

    const dispatch = useDispatch()

    // const [todos, setTodos] = useState(null)
    const todos = useSelector(storeState => storeState.todoModule.todos)
    const isLoading = useSelector(storeState => storeState.todoModule.isLoading)
    const user = useSelector(storeState => storeState.userModule.loggedinUser)


    // Special hook for accessing search-params:
    const [searchParams, setSearchParams] = useSearchParams()

    const defaultFilter = todoService.getFilterFromSearchParams(searchParams)
    const filterBy = useSelector(storeState => storeState.todoModule.filterBy)


    // const [filterBy, setFilterBy] = useState(defaultFilter)

    useEffect(() => {
        onSetFilterBy(defaultFilter)
    }, [])



    useEffect(() => {
        setSearchParams(filterBy)
        loadTodos(filterBy)
            .then(todos => {
                showSuccessMsg(`Todos loaded`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot load todos ')
            })
    }, [filterBy])

    function onRemoveTodo(todoId) {
        const userConfirm = confirm('Please confirm to remove todo!')
        if (!userConfirm) return
        removeTodo(todoId)
            .then(() => {
                showSuccessMsg(`Todo removed`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot remove todo ' + todoId)
            })
    }

    function onSetFilterBy(filterBy) {
        dispatch({ type: SET_FILTER_BY, filterBy })
    }

    function onToggleTodo(todo) {
        if (!user) return
        const todoToSave = { ...todo, isDone: !todo.isDone }
        saveTodo(todoToSave)
            .then((savedTodo) => {
                showSuccessMsg(`Todo is ${(savedTodo.isDone) ? 'done' : 'back on your list'}`)
                if (todoToSave.isDone) {
                    updateBalance(10)
                        .catch(err => {
                            console.log('err:', err)
                            showErrorMsg('Cannot update balance ')
                        })
                }

            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot toggle todo ' + todoId)
            })
    }

    if (!todos) return <div>Loading...</div>
    return (
        <section className="todo-index">
            <TodoFilter onSetFilterBy={onSetFilterBy} filterBy={filterBy} />
            <TodoSort filterBy={filterBy} onSetFilterBy={onSetFilterBy} />

            <div>
                {user && <Link to="/todo/edit" className="btn" >Add Todo</Link>}
            </div>
            <h2>Todos List</h2>
            {isLoading
                ? <p>Loading...</p>
                : <React.Fragment>
                    <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
                    <hr />
                    <h2>Todos Table</h2>
                    <div style={{ width: '60%', margin: 'auto' }}>
                        <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
                    </div>
                </React.Fragment>}
        </section >
    )
}