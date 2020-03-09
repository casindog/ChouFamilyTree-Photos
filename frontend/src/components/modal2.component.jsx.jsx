import React, {useState, useContext} from 'react'
import axios from 'axios'
import { RootContext } from '../App.js';
import {useQuery, useMutation} from '@apollo/react-hooks'
import {getGGFQuery} from '../graphQL/queries'
import {editSelectedMutation} from '../graphQL/mutations'

function Modal() {
    const {state, dispatch} = useContext(RootContext) 
    const {refetch} = useQuery(getGGFQuery)
    const [name, setName] = useState('')
    const [selectedName, setselectedName] = useState('')
    const [info, setInfo] = useState('')
    const [editSelected] = useMutation(editSelectedMutation)


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

    const handleUpdate = e => {
        e.preventDefault()

        editSelected({
            variables: {
                id: state.parent.selectedId,
                name: selectedName
            },
            refetchQueries: [{ query: getGGFQuery}]
        })

        let data = {
            selectedId: state.parent.selectedId,
            selectedName,
            parentId: state.parent.parentId,
            parentName: state.parent.parentName,
            children: state.parent.children
        }

        dispatch({ type: 'TOGGLE_MODAL', payload: data })
    }

    return (
        <div id='modal2'>
            <div id='child-info'>Add child to {state.parent.selectedName}</div>
            <input id='child-input' type='text' value={name} onChange={e => setName(e.target.value)} />

            {/* <div>Info</div>
            <textarea type='text' value={info} onChange={e => setInfo(e.target.value)} /> */}
            <button id='child-submit' onClick={handleSubmit}>Add child</button>

            <div id='parent-info'>Edit {state.parent.selectedName}</div>
            <input id='parent-input' type='text' placeholder={state.parent.selectedName} value={selectedName} onChange={e => setselectedName(e.target.value)} />
            <button onClick={handleUpdate} id='parent-submit'>Update</button>

            { !state.parent.children.length && state.parent.id !== "5e5373a07ffd4c292be15f36" ? 
                    <button id='deleteSelf' onClick={handleDelete}>Delete {state.parent.selectedName}</button>
                    : null
            }
            <button id='close' onClick={() => dispatch({type: 'TOGGLE_MODAL', payload: null})}>Close</button>

        </div>

    )
}

export default Modal