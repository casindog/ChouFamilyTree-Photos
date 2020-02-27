import React, {useState, useContext} from 'react'
import axios from 'axios'
import { RootContext } from '../App.js';
import {getGGFQuery} from '../graphQL/queries'
import {useQuery} from '@apollo/react-hooks'

function Modal() {
    const {state, dispatch} = useContext(RootContext) 
    const {refetch} = useQuery(getGGFQuery)

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
                    .then(async () => {
                        // use graphql to query GGF descendent again. 
                        await refetch()
                        dispatch({type: 'TOGGLE_MODAL', payload: null})

                    })
                    .catch((err) => {
                        return console.log(err)
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
            .then(() => {
                axios.patch(`./descendents`, data)
                .then(async () => {
                    await refetch()
                    dispatch({type: 'TOGGLE_MODAL', payload: null})
                })
            })
  
    }

    return (
        <div id='modal2'>
            <div>Add child to {state.parent.selectedName}</div>

            <div>Child name</div>
            <input type='text' value={name} onChange={e => setName(e.target.value)} />

            <div>Child info</div>
            <textarea type='text' value={info} onChange={e => setInfo(e.target.value)} />
            
            <button onClick={handleSubmit}>Add child</button>
            { !state.parent.children.length ? 
                <button onClick={handleDelete}>Delete {state.parent.selectedName}</button>
                : null
            }
            <button onClick={() => dispatch({type: 'TOGGLE_MODAL', payload: null})}>Close</button>
        </div>

    )
}

export default Modal