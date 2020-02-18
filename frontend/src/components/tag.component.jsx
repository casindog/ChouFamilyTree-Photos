import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { RootContext } from '../App'

const Tag = () => {
    const {state, dispatch} = useContext(RootContext)

    const [tag, setTag] = useState('')
    const [tagUpload, setTagUpload] = useState([])


    const createTags = () => {
        return (
            <div>
                { state.photo.persons.map(tag => <div> {tag.name} </div> ) }
            </div>
        )
    }

    function dfs(node,name) {
        let arr = []
        // console.log(node.name, name)
        if (node.name.toLowerCase().includes(name)) {
            arr.push(node.name)
            return arr
        }
        for (let c of node.children) {
            arr = arr.concat(dfs(c,name))
        }

        return arr
    }

    useEffect(() => {
        let arr = []

        if (state.svgRef) {
            // let res = dfs(state.tree, tag.toLowerCase())
            let svg = state.svgRef

            //links
            // svg.selectAll('.link')
            // .data(root.links())
            // .join('path')
            // .attr('class', 'link')
            // .attr('fill','none')
            // .attr('stroke', 'black')

            //nodes
            svg.selectAll('.node')
                .style('fill', d => {
                    if (d.data.name.toLowerCase().includes(tag.toLowerCase())
                        && tag.length) {
                        
                        console.log(d.data)
                        arr.push({ personId: d.data.personId, name: d.data.name })
                        return 'blue'
                    }
                    return 'black'
                })


        }
        setTagUpload(arr)

    },[tag])

    const tagPersonToPhoto = e => {

        if (state.photo._id) {
            axios.patch(`./photos/${state.photo._id}`, { data: tagUpload } )
                .then(res => {
                    // dispatch action to update tags
                    console.log(res.data)
                    let data = state.photo
                    
                    data.persons = res.data.tags

                    dispatch( {type: 'SET_PHOTO', payload: data} )
                })
        }

    }

    return (
        <div>
            Tags: {createTags()}
            <input type='text' onChange={e => setTag(e.target.value)}></input>
            <button onClick={tagPersonToPhoto}> Tag Person </button>
        </div>
    )
}

export default Tag