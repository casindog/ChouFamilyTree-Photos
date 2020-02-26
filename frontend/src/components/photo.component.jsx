import React, { useContext } from 'react'
import { RootContext } from '../App.js';

const Photo = () => {
    const {state} = useContext(RootContext) 

    return (
        <>
        { state.photo.path ? 
            <img alt='main-img' src={state.photo.path}/>
            : null
        }
        </>
    )
}

export default Photo