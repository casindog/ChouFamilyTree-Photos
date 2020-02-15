import React, {useEffect, useContext} from 'react'
import './photo.styles.css'
import { RootContext } from '../App.js';

const Photo = () => {
    const {state, dispatch} = useContext(RootContext) 

    return (
        <img id="photo" src={state.photo.path}/>
    )
}

export default Photo