import React, {useState, useContext} from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { RootContext } from '../App.js';

function Modal() {
    const {state, dispatch} = useContext(RootContext) 

    const [name, setName] = useState('')
    const [info, setInfo] = useState('')

    const handleSubmit = e => {
        e.preventDefault()
        let chouData = {
            name,
            info
        }

        axios.post('./chous', chouData)
            .then(res => {
                console.log(res.data)
                let treeData = {
                    parentId: state.parent.parentId,
                    child: res.data.data
                }
                axios.patch(`./trees/${state.tree._id}`, treeData)
                    .then(res => {
                        dispatch({type: 'SET_TREE', payload: res.data})
                        dispatch({type: 'TOGGLE_MODAL', payload: null})
                    })

            })   
    }

    const handleDelete = e => {
        e.preventDefault()
        // axios.delete('')
    }

    return ReactDOM.createPortal (
        <div>
            Add Child to Parent: {state.parent.parentName}

            <form onSubmit={handleSubmit}>
                <label>
                    Child Name
                    <input type='text' value={name} onChange={e => setName(e.target.value)} />
                </label>

                <label>
                    Child Description
                    <textarea type='text' value={info} onChange={e => setInfo(e.target.value)} />
                </label>
                
                <button type="submit">Submit</button>
            </form>

            <button onClick={handleDelete}>Delete</button>
            <button onClick={null}>Close</button>

        </div>,

        document.getElementById('modal-root')

    )
}

export default Modal