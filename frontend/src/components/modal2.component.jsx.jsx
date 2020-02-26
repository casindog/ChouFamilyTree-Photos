import React, {useState, useContext} from 'react'
import axios from 'axios'
import { RootContext } from '../App.js';
import './modal2.styles.css'
import {getGGFQuery} from '../graphQL/queries'
import {useQuery} from '@apollo/react-hooks'

function Modal() {
    const {state, dispatch} = useContext(RootContext) 
    const { loading, data, refetch } = useQuery(getGGFQuery)

    const [name, setName] = useState('')
    const [info, setInfo] = useState('')

    const handleSubmit = e => {
        e.preventDefault()
        let descendent = {
            name,
            info,
            parentId: state.parent.selectedId,
            action: 'add'
        }

        axios.post('./descendents', descendent)
            .then(res => {
                let data = {
                    parentId: state.parent.selectedId,
                    childId: res.data._id,
                    action: 'add'
                }
                axios.patch('./descendents', data)
                    .then(() => {
                        // use graphql to query GGF descendent again. 
                        refetch()
                    })
                
            })   
    }

    const handleDelete = e => {
        e.preventDefault()
        let data = {
            parentId: state.parent.parentId,
            childId: state.parent.selectedId,
            action: 'del'
        }
        axios.delete(`./descendents/${state.parent.selectedId}`)
            .then(res => {
                axios.patch(`./descendents`, data)
                .then(() => {
                    refetch()
                })
            })
  
    }

    return (
        <div id='modal2'>
            <div>Add child to {state.parent.selectedName}</div>

            Child name
            <input type='text' value={name} onChange={e => setName(e.target.value)} />

            Child info
            <textarea type='text' value={info} onChange={e => setInfo(e.target.value)} />
            
            <button onClick={handleSubmit}>Add child</button>
            <button onClick={handleDelete}>Delete {state.parent.selectedName}</button>
            <button onClick={() => dispatch({type: 'TOGGLE_MODAL', payload: null})}>Close</button>
        </div>

    )
}

export default Modal