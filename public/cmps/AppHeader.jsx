const { useState, useEffect } = React
const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector, useDispatch } = ReactRedux


import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { todoService } from '../services/todo.service.js'
import { logout } from '../store/actions/user.actions.js'


export function AppHeader() {
    const navigate = useNavigate()
    const user = useSelector(storeState => storeState.userModule.loggedinUser)
    const [doneTodos, setDoneTodos] = useState()
    const todos = useSelector(storeState => storeState.todoModule.todos)


    useEffect(() => {
        todoService.getDoneTodos().then(doneTodos => {
            setDoneTodos(doneTodos[0].value)
        })
    }, [todos])

    function onLogout() {
        logout()
            .then(() => {
                navigate('/')
                showSuccessMsg('Logged out')
            })
            .catch((err) => {
                showErrorMsg('OOPs try again')
            })
    }


    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>Todo's</h1>
                {/* <progress value={doneTodos} max={todos.length}></progress> */}

                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/todo" >Todos</NavLink>
                    {/* <NavLink to="/dashboard" >Dashboard</NavLink> */}
                </nav>

                {user ? (
                    < section className="user">
                        <Link to={`/user/${user._id}`}>{user.fullname}</Link>
                        <p>{user.balance} 💳</p>
                        <button onClick={onLogout}>Logout</button>

                    </ section >
                ) : (
                    <section className="user">
                        <LoginSignup />
                    </section>
                )}
            </section>
            <UserMsg />
        </header>
    )
}
