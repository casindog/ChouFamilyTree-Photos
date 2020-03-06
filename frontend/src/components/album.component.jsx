import React, {useState, useEffect, useContext} from 'react'
import { RootContext } from '../App.js';
import {useQuery} from '@apollo/react-hooks'
import {getAlbum} from '../graphQL/queries'

const Album = () => {
    const {state, dispatch} = useContext(RootContext) 
    const { loading, data } = useQuery(getAlbum)
    const [x, setX] = useState(0)

    const styles = {
        transform: `translate(${x}px)`,
        transition: 'all 1s'
    }

    console.log(x)

    useEffect(() => {
        // turn this into graphql
        if (!loading && data) {
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
        }

        // eventually, i want to pass in a selected person from
        // the store to filter the album w/ photos tagged w/ selected person
    }, [state.photo, data])

    if (loading) return null

    return (

        <div id='album'>

            <img id='slider-left' onClick={() => setX(Math.min(0,x+100))} src="leftright.png" alt=""/> 

            
            <div id='album-images'>
                {data.photos.map(img => (
                    <div key={img.id} style={styles}>
                        <img className='slider-img'
                            alt='album'
                            onClick={() => {
                                dispatch({type: 'SET_PHOTO', payload: img})
                            }}
                            src={img.path}>
                        </img>
                    </div>
                ))}
            </div>
            <img id='slider-right' onClick={() => setX(x-100)} src="leftright.png" alt=""/>    

        </div>


    )
}

export default Album