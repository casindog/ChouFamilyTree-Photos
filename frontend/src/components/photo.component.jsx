import React, {useEffect, useContext} from 'react'
import axios from 'axios';
import './photo.styles.css'
import { RootContext } from '../App.js';

// file upload resource
// https://codeburst.io/image-uploading-using-react-and-node-to-get-the-images-up-c46ec11a7129

// actual photo main
// tags
const Photo = () => {
    const {state, dispatch} = useContext(RootContext) 

    return (
        <img id="photo" src={state.photo.path}/>
    )
}

export default Photo