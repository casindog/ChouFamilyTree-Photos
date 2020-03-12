import React, {useContext} from 'react'
import axios from 'axios';
import { RootContext } from '../App.js';
import {useQuery} from '@apollo/react-hooks'
import {getAlbum} from '../graphQL/queries'

// file upload resource
// https://codeburst.io/image-uploading-using-react-and-node-to-get-the-images-up-c46ec11a7129

const File = () => {
    const {state, dispatch} = useContext(RootContext) 
    const album = useQuery(getAlbum)

    const handleFile = e => {
        if (e.target.files.length) { dispatch({type: 'SET_FILE', payload: e.target.files[0]}) }
    }

    const uploadFile = e => {
        e.preventDefault();
        // might have to turn this into graphql
        const fd = new FormData()
        fd.append('file', state.file);

        axios.post('./photos', fd)
            .then(res => { 
                res.data.id = res.data._id
                dispatch({type: 'SET_PHOTO', payload: res.data}) 
                album.refetch()
            })
    }   

    return (
        <div id="title-right">
            <div> Upload a Photo </div>
            <input type='file' onChange={handleFile}></input>
            <button onClick={uploadFile}>Upload</button>
        </div>
    )
}

export default File