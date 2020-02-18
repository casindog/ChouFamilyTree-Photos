import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { RootContext } from '../App'
import './tag.styles.css'

const Tag = () => {
    const {state, dispatch} = useContext(RootContext)
    const [tag, setTag] = useState('')
    const [tagUpload, setTagUpload] = useState([])

    useEffect(() => {
        let newArr = []

        if (state.svgRef) {
            // let res = dfs(state.tree, tag.toLowerCase())
            let svg = state.svgRef
            let arr = state.photo.persons.map(person => person.personId)

            //nodes
            svg.selectAll('.node')
                .style('fill', d => {
                    if (arr.indexOf(d.data.personId)>=0) {
                        return 'red'
                    }

                    if (d.data.name.toLowerCase().includes(tag.toLowerCase())
                        && tag.length) {
                        
                        newArr.push({ personId: d.data.personId, name: d.data.name })
                        return 'blue'
                    }
                    // return 'black'
                })

        }
        setTagUpload(newArr)

    },[tag])

    useEffect(() => {
        if (state.svgRef) {
            let svg = state.svgRef
            let arr = state.photo.persons.map(person => person.personId)

            //links
            // svg.selectAll('.link')
            //     .style('stroke', d => {
            //         // run a lca algorithm, and paint line red
            //         // if (state.photos.persons)
            //         return 'red'
            //     })

            //nodes
            svg.selectAll('.node')
                .style('fill', d => {
                    return arr.indexOf(d.data.personId)>=0 ? 'red' : 'black'
                })
        }
    }, [...Object.values(state.photo)])

    const tagPersonToPhoto = e => {
        if (state.photo._id) {
            axios.patch(`./photos/${state.photo._id}`, { data: tagUpload } )
                .then(res => {
                    // b/c it's hard to update embedded/nested objects w/ hooks
                    // we have intermediate step to copy the photo object,
                    // then update the tag information
                    let data = state.photo
                    data.persons = res.data.tags
                    dispatch( {type: 'SET_PHOTO', payload: data} )

                    // update the tree
                })
        }

        setTag('')

    }

    const untagPersonFromPhoto = (e) => {
        let photoId = state.photo._id
        let personId = e.target.attributes.getNamedItem('personId').value
        let data = {
            type: 'del',
            personId
        }

        axios.patch(`./photos/${photoId}`, data)
            .then(res => {
                let data = state.photo
                data.persons = res.data.tags
                dispatch({ type: 'SET_PHOTO', payload: data })
            })

    }

    return (
        <>
            <div id='tag-wrapper'>
                { state.photo.persons.map(tag => <div 
                    personid={tag.personId}
                    key={tag.personId} 
                    onClick={untagPersonFromPhoto} 
                    className='tag'> {tag.name} </div> )}
            </div>
            <div id='add-tag'>
                <input type='text' value={tag} onChange={e => setTag(e.target.value)}></input>
                <button onClick={tagPersonToPhoto}> Add Tag </button>
            </div>
 
        </>
    )
}

export default Tag