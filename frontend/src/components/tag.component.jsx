import React, {useContext} from 'react'
import axios from 'axios'
import { RootContext } from '../App'

const Tag = () => {
    const {state, dispatch} = useContext(RootContext)
    const createTags = () => {
        return (
            <div>
                {state.photo.persons.map(tag => (<div> {tag.name} </div> )
                )}
            </div>
        )
    }

    const tagPersonToPhoto = e => {
        let arr = state.photo.persons
        // arr.push()
        // push into an array -> {
            // name
        // }
        let data = {
            photoId: state.photo._id,
            persons: arr // from the event target, which might be saved
        }

        let name = {'test': 'chouA'}
        let testid = '5e424127486c82850be92468'

        axios.patch(`./photos/${testid}`, data)
            .then(res => 
                // i want to update the tags, so dispatch action
                console.log(res)
            )
    }

    return (
        <div>
            Tags: {createTags()}
            <input type='text' onChange={null}></input>
            <button onClick={tagPersonToPhoto}> Tag Person </button>
        </div>
    )
}

export default Tag