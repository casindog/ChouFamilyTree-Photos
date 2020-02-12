import React, {useState, useEffect} from 'react'
import axios from 'axios';
import './photo.styles.css'
import { Tag } from './tag.component'

// https://codeburst.io/image-uploading-using-react-and-node-to-get-the-images-up-c46ec11a7129
export const Photo = () => {
    const [file, setFile] = useState(null)
    const [photo, setPhoto] = useState(null)
    const [album, setAlbum] = useState(null) 

    useEffect(() => {
        (async () => {
            let res = await axios.get('/photos')
            await setAlbum(res.data)
        })()
        // seems like this is still running more than componentdidmount
        // eventually, i want to pass in a selected person from
        // the store to filter the album w/ photos tagged w/ selected person
    },[])

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
            .then(res => { setPhoto(res.data.path) })
    }   

    const tagPersonToImg = e => {
        let name = {'test': 'chouA'}
        let testid = '5e424127486c82850be92468'
        axios.patch(`./photos/${testid}`, name)
            .then(res => console.log(res))
        // db.students.update(
        //     { _id: 1 },
        //     { $push: { scores: 89 } }
        //  )

    }

    const createImages = () => {
        if (album)  {
            return (
                <div id='album'>
                    {album.map(img => <img key={img._id} onClick={() => setPhoto(img.path)} src={img.path}></img>)}
                </div>
            )
        }
    }

    console.log(album)
    return (
        <div id='photo'>
            <h3>Upload a Photo</h3>
            <input type='file' onChange={() => handleChange}></input>
            <button onClick={() => uploadFile}>Upload</button>
            <img id="main" src={photo}/>
            <Tag/> 
            <button onClick={tagPersonToImg}> Tag Person </button>

            {createImages()}

        </div>
    )
}