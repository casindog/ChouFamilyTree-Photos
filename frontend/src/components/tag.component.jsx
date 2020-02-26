import React, {useState, useEffect, useContext} from 'react'
import { RootContext } from '../App'
import './tag.styles.css'
import { useQuery, useMutation} from '@apollo/react-hooks'
import {getAlbum, getGGFQuery, editPhotoTagsMutation} from '../graphQL/queries'
import { select, hierarchy, tree, linkVertical, scaleLinear } from 'd3'


const Tag = () => {
    const {state} = useContext(RootContext)
    const [tag, setTag] = useState('')
    const [tagUpload, setTagUpload] = useState([])
    const { loading, data } = useQuery(getAlbum)
    const tree = useQuery(getGGFQuery)
    const [editPhotoTags] = useMutation(editPhotoTagsMutation)

    useEffect(() => {
        let newArr = []

        if (state.svgRef && state.photo.id) {
            let svg = state.svgRef

            // I'd prefer to use the getPhoto gql, but i had issues w/ query variables
            let main = {persons: []};
            for (let photo of data.photos) {
                if (photo.id === state.photo.id) {
                    main = photo;
                    break;
                }
            }

            let arr = main.persons.map(person => person.id)

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

        setTagUpload(newArr[0])

    },[tag])

    useEffect(() => {
        if (state.svgRef && state.photo.id) {
            let svg = state.svgRef

            // I'd prefer to use the getPhoto gql, but i had issues w/ query variables
            let main = {persons: []};
            for (let photo of data.photos) {
                if (photo.id === state.photo.id) {
                    main = photo;
                    break;
                }
            }

            let arr = main.persons.map(person => person.id)
            console.log(main)

            // draw a red line that connects everyone to GGF
            // recursion, if the node is one of the people in the photo, then return true
            // this would mean 1) GGF can have red lines to him, but he will not be in the photo, so his node is black
            // 2) generation gaps, grandchildren can link up to the GGF. the generation in between will still be black (not in photo)

            let relationships = dfs(tree.data.descendent, arr) 
            console.log(relationships)

            // return an array with all of target -> source relationship
            // then in D3, check every link's target and source, and change red
            let hash = {}
            for (let r of relationships) {
                for (let i=r.length-1; i>0; i--) {
                    hash[r[i]] = r[i-1]
                }
            }
            console.log(hash)
            console.log(tree.data.descendent)
            const root = hierarchy(tree.data.descendent)

            //links
            svg.selectAll('.link')
                .data(root.links())
                .join('path')
                .style('stroke', d => {
                    // source goes to value
                    // target goes to key
                    if (hash[d.target.data.id] === d.source.data.id) {
                        console.log(d.target.data.id, d.source.data.id)
                        return 'red'
                    }
                })

            //nodes
            svg.selectAll('.node')
                .data(root.descendants())
                .join('circle')
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

    }, [state.photo, tree.data, data])

    const tagPersonToPhoto = e => {
        if (tagUpload) {
            editPhotoTags({
                variables: {
                    photoId: state.photo.id,
                    personId: tagUpload.id,
                    action: "add"
                },
            })
        }

        setTag('')

    }

    const untagPersonFromPhoto = (e) => {
        if (state.photo.id) {
            editPhotoTags({
                variables: {
                    photoId: state.photo.id,
                    personId: e.target.attributes.getNamedItem('personId').value,
                    action: "del"
                },
            })
        }

    }

    function createTags() {
        if (state.photo.id) {
            // I'd prefer to use the getPhoto gql, but i had issues w/ query variables
            let main = {persons: []};
            for (let photo of data.photos) {
                if (photo.id === state.photo.id) {
                    main = photo;
                    break;
                }
            }

            return main.persons.map(tag => 
                <div 
                    personid={tag.id}
                    key={tag.id} 
                    onClick={untagPersonFromPhoto} 
                    className='tag'> {tag.name} 
                </div> 
            )
        }
    }

    if (loading) return null

    return (
        <>
            <div id='tag'>
                {createTags()}

                <input type='text' value={tag} onChange={e => setTag(e.target.value)}></input>
                <button onClick={tagPersonToPhoto}> Add Tag </button>
            </div>
          
        </>
    )
}

export default Tag