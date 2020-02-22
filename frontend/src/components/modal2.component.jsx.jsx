import React, {useState, useContext} from 'react'
import axios from 'axios'
import { RootContext } from '../App.js';
import './modal.styles.css'

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
        let data = {
            personId: state.parent.parentId
        }
        axios.delete(`./trees/${state.tree._id}`, {data})
            .then(res => {
                dispatch({type: 'SET_TREE', payload: res.data })
                dispatch({type: 'TOGGLE_MODAL', payload: null})
            })
    }

    return (
        <div id='modal'>
            <div>Add child to {state.parent.parentName}</div>

            Child name
            <input type='text' value={name} onChange={e => setName(e.target.value)} />

            Child description
            <textarea type='text' value={info} onChange={e => setInfo(e.target.value)} />
            
            <button onClick={handleSubmit}>Add child</button>
            <button onClick={handleDelete}>Delete me</button>
            <button onClick={() => dispatch({type: 'TOGGLE_MODAL', payload: null})}>Close</button>

        </div>
    )
}

export default Modal