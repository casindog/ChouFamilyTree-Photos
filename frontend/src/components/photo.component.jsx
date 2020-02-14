import React, {useEffect, useContext, useReducer} from 'react'
import axios from 'axios';
import './photo.styles.css'
import { Tag } from './tag.component'
import { RootContext } from '../App.js';

// file upload resource
// https://codeburst.io/image-uploading-using-react-and-node-to-get-the-images-up-c46ec11a7129

const Photo = () => {
    // const rootContext = useContext(RootContext) 
    const {state, dispatch} = useContext(RootContext) 

    useEffect(() => {
        axios.get('/photos')
            .then(res => { dispatch({type: 'FETCH_ALBUM', payload: res.data}) })

        // eventually, i want to pass in a selected person from
        // the store to filter the album w/ photos tagged w/ selected person
    },[])

    const handleFile = e => {
        if (e.target.files.length) { dispatch({type: 'SET_FILE', payload: e.target.files[0]}) }
    }

    const uploadFile = e => {
        e.preventDefault();
        const fd = new FormData()
        fd.append('file', state.file);

        axios.post('./photos', fd)
            .then(res => { dispatch({type: 'SET_PHOTO', payload: res.data.path}) })
    }   

    const tagPersonToImg = e => {
        let name = {'test': 'chouA'}
        let testid = '5e424127486c82850be92468'
        axios.patch(`./photos/${testid}`, name)
            .then(res => console.log(res))
    }

    const createImages = () => {
        if (state.album)  {
            return (
                <div id='album'>
                    {state.album.map(img => (
                        <img 
                            key={img._id} 
                            onClick={() => dispatch({type: 'SET_PHOTO', payload: img.path}) }
                            src={img.path}>
                        </img>)
                    )}
                </div>
            )
        }
    }

    return (
        <div id='photo'>
            <h3>Upload a Photo</h3>
            <input type='file' onChange={handleFile}></input>
            <button onClick={uploadFile}>Upload</button>

            <img id="main" src={state.photo}/>

            <h4>Tagged:</h4>
            <Tag/> 

            <input type='text' onChange={null}></input>
            <button onClick={tagPersonToImg}> Tag Person </button>

            {createImages()}

        </div>
    )
}

export default Photo