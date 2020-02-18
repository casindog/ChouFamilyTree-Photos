import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { RootContext } from '../App'
import './tag.styles.css'

const Tag = () => {
    const {state, dispatch} = useContext(RootContext)

    const [tag, setTag] = useState('')
    const [tagUpload, setTagUpload] = useState([])

    // function dfs(node,name) {
    //     let arr = []
    //     // console.log(node.name, name)
    //     if (node.name.toLowerCase().includes(name)) {
    //         arr.push(node.name)
    //         return arr
    //     }
    //     for (let c of node.children) {
    //         arr = arr.concat(dfs(c,name))
    //     }

    //     return arr
    // }

    useEffect(() => {
        let arr = []

        if (state.svgRef) {
            // let res = dfs(state.tree, tag.toLowerCase())
            let svg = state.svgRef
            let arr = state.photo.persons.map(person => person.personId)

            //nodes
            svg.selectAll('.node')
                .style('fill', d => {
                    if (arr.indexOf(d.data.personId)>=0) return 'red'

                    if (d.data.name.toLowerCase().includes(tag.toLowerCase())
                        && tag.length) {
                    
                        arr.push({ personId: d.data.personId, name: d.data.name })
                        return 'blue'
                    }
                    return 'black'
                })


        }
        setTagUpload(arr)
    },[tag])

    useEffect(() => {
        console.log('loktar')
        if (state.svgRef) {
            let svg = state.svgRef
            let arr = state.photo.persons.map(person => person.personId)

            //links
            console.log(state.photo.persons)
            console.log(arr)
            // svg.selectAll('.link')
            //     .style('stroke', d => {
            //         console.log(d)
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
    },[state.photo])

    const tagPersonToPhoto = e => {
        if (state.photo._id) {
            axios.patch(`./photos/${state.photo._id}`, { data: tagUpload } )
                .then(res => {
                    // dispatch action to update tags
                    let data = state.photo
                    
                    data.persons = res.data.tags

                    dispatch( {type: 'SET_PHOTO', payload: data} )
                })
        }

    }

    return (
        <>
            <div id='tag-wrapper'>
                { state.photo.persons.map(tag => <div key={tag.personId} className='tag'> {tag.name} </div> )}
            </div>
            <div id='add-tag'>
                <input type='text' onChange={e => setTag(e.target.value)}></input>
                <button onClick={tagPersonToPhoto}> Add Tag </button>
            </div>
 
        </>
    )
}

export default Tag