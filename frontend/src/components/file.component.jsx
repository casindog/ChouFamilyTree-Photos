import React, {useContext} from 'react'
import axios from 'axios';
import { RootContext } from '../App.js';


// file upload resource
// https://codeburst.io/image-uploading-using-react-and-node-to-get-the-images-up-c46ec11a7129

const File = () => {
    const {state, dispatch} = useContext(RootContext) 

    const handleFile = e => {
        if (e.target.files.length) { dispatch({type: 'SET_FILE', payload: e.target.files[0]}) }
    }

    const uploadFile = e => {
        e.preventDefault();
        const fd = new FormData()
        fd.append('file', state.file);

        axios.post('./photos', fd)
            .then(res => { 
                dispatch({type: 'SET_PHOTO', payload: res.data}) 
                axios.get('/photos')
                    .then(res => { dispatch({type: 'FETCH_ALBUM', payload: res.data}) })
            })
    }   

    return (
        <div id="title-left">
            <div> Upload a Photo </div>
            <input type='file' onChange={handleFile}></input>
            <button onClick={uploadFile}>Upload</button>
        </div>
    )
}

export default File