const { useState } = React
const { useSelector } = ReactRedux

export function UserDetails() {

    const user = useSelector(storeState => storeState.loggedinUser)
    const [userToEdit, setUserToEdit] = useState(user)

    function handleChange({ target }) {
        const field = target.name
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

        setUserToEdit(prevUserToEdit => ({ ...prevUserToEdit, [field]: value }))
    }

    function onSaveUser(ev) {
        ev.preventDefault()

    }

    const { fullname, color, backgroundColor } = userToEdit

    return (
        <section className="todo-edit">
            <form onSubmit={onSaveUser} >
                <label htmlFor="fullname">fullname:</label>
                <input onChange={handleChange} value={fullname} type="text" name="fullname" id="fullname" />

                <button>Save</button>
            </form>
        </section>
    )
}