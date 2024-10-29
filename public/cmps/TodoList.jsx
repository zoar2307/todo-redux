import { showSuccessMsg } from "../services/event-bus.service.js"
import { saveTodo } from "../store/actions/todo.actions.js"
import { TodoPreview } from "./TodoPreview.jsx"
const { Link } = ReactRouterDOM

export function TodoList({ todos, onRemoveTodo, onToggleTodo }) {


    function handleChange({ target }, todo) {
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        const todoToSave = { ...todo, backgroundColor: value }
        saveTodo(todoToSave)
            .then((savedTodo) => {
                showSuccessMsg(`Background color changed to : ${savedTodo.backgroundColor}`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot change background color ' + todoId)

            })

    }

    if (todos.length === 0) return <p>no todos to show..</p>
    return (
        <ul className="todo-list">
            {todos.map(todo =>
                <li style={{
                    backgroundColor: todo.backgroundColor
                }} key={todo._id}>
                    <TodoPreview todo={todo} onToggleTodo={() => onToggleTodo(todo)} />
                    <section>
                        <button onClick={() => onRemoveTodo(todo._id)}>Remove</button>
                        <button><Link to={`/todo/${todo._id}`}>Details</Link></button>
                        <button><Link to={`/todo/edit/${todo._id}`}>Edit</Link></button>
                        <input type="color" value={todo.backgroundColor} onChange={(ev) => handleChange(ev, todo)} />
                    </section>
                </li>

            )}
        </ul>
    )
}