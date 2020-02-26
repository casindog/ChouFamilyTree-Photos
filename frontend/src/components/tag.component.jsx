import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { RootContext } from '../App'
import './tag.styles.css'
import {useMutation} from '@apollo/react-hooks'
import gql from 'graphql-tag'

const editTagToPhoto = gql`
mutation {
  editTagsToPhoto(photoId: "5e54db081ac47083042c96db", personId: "5e547b981c9d440000d23957", action: "add") {
		id persons {
		  id name
		}
  }
}
`

const Tag = () => {
    const {state, dispatch} = useContext(RootContext)
    const [tag, setTag] = useState('')
    const [tagUpload, setTagUpload] = useState([])
    const {loading, data } = useMutation(editTagToPhoto)

    useEffect(() => {
        let newArr = []

        if (state.svgRef) {
            let svg = state.svgRef
            let arr = state.photo.persons.map(person => person.id)

            //nodes
            svg.selectAll('.node')
                .style('fill', d => {
                    if (arr.indexOf(d.data.id)>=0) {
                        return 'red'
                    }

                    if (d.data.name.toLowerCase().includes(tag.toLowerCase())
                        && tag.length) {
                        
                        newArr.push({ id: d.data.id, name: d.data.name })
                        return 'blue'
                    }
                })

        }

        setTagUpload(newArr)

    },[state.photo, tag])

    useEffect(() => {
        if (state.svgRef) {
            let svg = state.svgRef
            let arr = state.photo.persons.map(person => person.id)

            // draw a red line that connects everyone to GGF
            // recursion, if the node is one of the people in the photo, then return true
            // this would mean 1) GGF can have red lines to him, but he will not be in the photo, so his node is black
            // 2) generation gaps, grandchildren can link up to the GGF. the generation in between will still be black (not in photo)

            let relationships = dfs(state.tree, arr) 
            // funny thing happens when rootNode GGF is in the picture,

            // return an array with all of target -> source relationship
            // then in D3, check every link's target and source, and change red
            let hash = {}
            for (let r of relationships) {
                for (let i=r.length-1; i>0; i--) {
                    hash[r[i]] = r[i-1]
                }
            }

            //links
            svg.selectAll('.link')
                .style('stroke', d => {
                    // source goes to value
                    // target goes to key
                    if (hash[d.target.data.id] === d.source.data.id) return 'red'
                })

            //nodes
            svg.selectAll('.node')
                .style('fill', d => {
                    return arr.indexOf(d.data.id)>=0 ? 'red' : 'black'
                })
        }

        function dfs(node, arr) {
            let res = []

            for (let c of node.children) {
                res = res.concat(dfs(c, arr))
            }

            res = res.map(ele => [node.id].concat(ele))

            if (arr.includes(node.id)) {
                res.push(node.id)
            }

            return res
        }

    }, [state.photo.persons])

    const tagPersonToPhoto = e => {
        if (state.photo.id) {
            // axios.patch(`./photos/${state.photo._id}`, { data: tagUpload } )
            //     .then(res => {
            //         // b/c it's hard to update embedded/nested objects w/ hooks
            //         // we have intermediate step to copy the photo object,
            //         // then update the tag information
            //         let data = state.photo
            //         data.persons = res.data.tags
            //         dispatch( {type: 'SET_PHOTO', payload: data} )
            //     })
        }

        setTag('')

    }

    const untagPersonFromPhoto = (e) => {
        // let photoId = state.photo._id
        // let personId = e.target.attributes.getNamedItem('personId').value
        // let data = {
        //     type: 'del',
        //     personId
        // }

        // axios.patch(`./photos/${photoId}`, data)
        //     .then(res => {
        //         let data = state.photo
        //         data.persons = res.data.tags
        //         dispatch({ type: 'SET_PHOTO', payload: data })
        //     })

    }

    return (
        <>
            <div id='tag'>
                { state.photo.persons.map(tag => <div 
                    personid={tag.personId}
                    key={tag.personId} 
                    onClick={untagPersonFromPhoto} 
                    className='tag'> {tag.name} </div> )}

                <input type='text' value={tag} onChange={e => setTag(e.target.value)}></input>
                <button onClick={tagPersonToPhoto}> Add Tag </button>
            </div>
          
        </>
    )
}

export default Tag