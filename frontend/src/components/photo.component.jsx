import React, {useState} from 'react'
import axios from 'axios';

// https://codeburst.io/image-uploading-using-react-and-node-to-get-the-images-up-c46ec11a7129
export const Photo = () => {
    const [photo, updatePhoto] = useState('')

    const uploadFile = (e) => {
        const fd = new
        axios.post('./api/photos')
    }

    return (
        <>
            Upload a Photo
            <input type='file' onChange={(e) => updatePhoto(e.target.files[0])}></input>
            <button onClick={(e) => uploadFile}>Upload</button>
            {photo}
        </>
    )
}