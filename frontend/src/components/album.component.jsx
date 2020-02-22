import React, {useEffect, useContext} from 'react'
import axios from 'axios'

import { RootContext } from '../App.js';

const Album = () => {
    const {state, dispatch} = useContext(RootContext) 

    useEffect(() => {
        axios.get('/photos')
            .then(res => { dispatch({type: 'FETCH_ALBUM', payload: res.data}) })

        // eventually, i want to pass in a selected person from
        // the store to filter the album w/ photos tagged w/ selected person
    }, [])

    const createImages = () => {
        return (
            <>
                {state.album.map(img => (
                    <div   key={img._id} >
                        <img 
                            alt='album'
                            onClick={() => {
                                dispatch({type: 'SET_PHOTO', payload: img})
                            }}
                            src={img.path}>
                        </img>
                    </div>

                ))}
            </>
        )
    }

    return (
        <div id='album'>
            {createImages()}
        </div>

    )
}

export default Album