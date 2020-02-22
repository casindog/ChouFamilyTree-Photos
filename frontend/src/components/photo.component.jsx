import React, {useEffect, useContext} from 'react'
import './photo.styles.css'
import { RootContext } from '../App.js';
import Tag from './tag.component'
import './tag.component'

const Photo = () => {
    const {state} = useContext(RootContext) 

    return (
        <div id='main-left'>
            <img alt='main-img' src={state.photo.path}/>
            <Tag/>
        </div>
    )
}

export default Photo