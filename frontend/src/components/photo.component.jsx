import React, {useState} from 'react'
import axios from 'axios';
import './photo.styles.css'

// https://codeburst.io/image-uploading-using-react-and-node-to-get-the-images-up-c46ec11a7129
export const Photo = () => {
    const [file, setFile] = useState(null)
    const [photo, setPhoto] = useState(null)

    const handleChange = e => {
        if (e.target.files.length) {
            setFile(e.target.files[0])
        }
    }

    const uploadFile = e => {
        e.preventDefault();
        const fd = new FormData()
        fd.append('file', file);

        axios.post('./photos', fd)
        .then(res => {
            setPhoto(res.data.path)
            console.log(res)
        })

    }   
    console.log(file)

    return (
        <div id='photo'>
            <h3>Upload a Photo</h3>
            <input type='file' onChange={handleChange}></input>
            <button onClick={uploadFile}>Upload</button>
            <img id="main" src={photo}/>
        </div>
    )
}