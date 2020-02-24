import React, {useEffect, useContext} from 'react'
import axios from 'axios'
import { RootContext } from '../App.js';

const Album = () => {
    const {state, dispatch} = useContext(RootContext) 

    useEffect(() => {
        axios.get('/photos')
            .then(res => { 
                dispatch({type: 'FETCH_ALBUM', payload: res.data}) 
                // force the resize to get the svg to render the correct proportions
                // b/c the album component is loaded after, it changes the svg size, but the change
                // isn't detected by the window resize

                // very clever solution found here
                // https://stackoverflow.com/questions/26556436/react-after-render-code
                setTimeout(()=> {
                    let svg = document.getElementsByTagName('svg')[0]
                    let rect = svg.getBoundingClientRect()
                    let dimensions = {
                        width: rect.width,
                        height: rect.height
                    }
                    
                    dispatch({type: 'SET_SVGDIMENSIONS', payload: dimensions})
                },0)
    
            })

        // eventually, i want to pass in a selected person from
        // the store to filter the album w/ photos tagged w/ selected person
    }, [])

    const createImages = () => {
        return (
            <>
                {state.album.map(img => (
                    <div   key={img._id} >
                        <img 
                            alt='album'
                            onClick={() => {
                                dispatch({type: 'SET_PHOTO', payload: img})
                            }}
                            src={img.path}>
                        </img>
                    </div>

                ))}
            </>
        )
    }

    return (
        <div id='album'>
            {createImages()}
        </div>

    )
}

export default Album