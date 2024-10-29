
const { useState, useEffect } = React
const { useSelector } = ReactRedux


export function TodoFilter({ onSetFilterBy, filterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })


    useEffect(() => {
        // Notify parent
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

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

            default: break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    // Optional support for LAZY Filtering with a button
    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    return (
        <section className="todo-filter">
            <h2>Filter Todos</h2>
            <form onSubmit={onSubmitFilter}>
                <input value={filterBy.txt} onChange={handleChange}
                    type="search" placeholder="By Txt" id="txt" name="txt"
                />
                <label htmlFor="importance">Importance: </label>
                <input value={filterBy.importance} onChange={handleChange}
                    type="number" placeholder="By Importance" id="importance" name="importance"
                />
                <select name="type" value={filterBy.type} onChange={handleChange}>
                    <option value="">all</option>
                    <option value="active">Active</option>
                    <option value="done">Done</option>
                </select>

                <button hidden>Set Filter</button>
            </form>
        </section>
    )
}