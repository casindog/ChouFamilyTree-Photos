import React, {useContext} from 'react'
import './photo.styles.css'
import { RootContext } from '../App.js';

const Photo = () => {
    const {state} = useContext(RootContext) 

    return (
        <img id="photo" alt='main-img' src={state.photo.path}/>
    )
}

export default Photo