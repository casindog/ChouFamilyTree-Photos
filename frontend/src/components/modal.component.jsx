import React, {useState, useContext} from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { RootContext } from '../App.js';

function Modal () {
    const {state, dispatch} = useContext(RootContext) 

    const [name, setName] = useState('')
    const [info, setInfo] = useState('')
    const [child, setChild] = useState('')

    const handleSubmit = e => {
        e.preventDefault()
        let data = {
            name,
            info,
            child
        }
        axios.post('./chous', data)
            .then(res => dispatch({type: 'SET_TREE', payload: res.data}))

        console.log(state.tree)
    }

    return ReactDOM.createPortal (
        <div>
            Update Information:

            <form onSubmit={handleSubmit}>
                <label>
                    Name
                    <input type='text' value={name} onChange={e => setName(e.target.value)} />
                </label>

                <label>
                    Description
                    <textarea type='text' value={info} onChange={e => setInfo(e.target.value)} />
                </label>

                <label>
                    Add Child
                    <input type='text' value={child} onChange={e => setChild(e.target.value)}/>
                </label>
                
                <button type="submit">Submit</button>
            </form>

            <button onClick={null}>Close</button>

        </div>,

        document.getElementById('modal-root')

    )
}

export default Modal