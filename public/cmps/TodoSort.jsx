import { utilService } from "../services/util.service.js"

const { useState, useEffect, useRef } = React
const { useSelector } = ReactRedux
const { Link, useSearchParams } = ReactRouterDOM



export function TodoSort({ filterBy, onSetFilterBy }) {

    const [sortByToEdit, setSortByToEdit] = useState({ ...filterBy })
    const debouncedSetFilterRef = useRef(utilService.debounce(onSetFilterBy, 500))
    const user = useSelector(storeState => storeState.userModule.loggedinUser)




    useEffect(() => {
        // Notify parent
        debouncedSetFilterRef.current(sortByToEdit)
    }, [sortByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        console.log('field:', field)

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

        setSortByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }


    return (
        <div className="sort-container">
            <select value={filterBy.sort} name="sort" onChange={handleChange} id="sort">
                <option value="">Sort By</option>
                <option value="txt">Text</option>
                <option value="createdAt">Time</option>
            </select>
            {user && <Link to="/todo/edit" className="btn" >Add Todo</Link>}

        </div>
    )
}
