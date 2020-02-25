import React, {useRef, useEffect, useContext} from 'react'
import { RootContext } from '../App'
import { select, hierarchy, tree, linkVertical, scaleLinear } from 'd3'
import Modal from "./modal2.component.jsx"
import {useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'

const getGGFQuery = gql`
    {
        descendent(id: "5e5373a07ffd4c292be15f36"){
            id name info
            spouse {
                id name
            }
            children {
                id name info
                spouse {
                    id name
                }
                children {
                    id name info
                    spouse {
                        id name
                    }
                    children {
                        id name info
                        spouse {
                            id name
                        }
                        children {
                            id name info
                            spouse {
                                id name
                            }
                            children {
                                id name info
                                spouse {
                                    id name
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`

const Tree = () => {
    const svgRef = useRef()
    const {state, dispatch} = useContext(RootContext)
    const { loading, data } = useQuery(getGGFQuery)

    const resizeListener = () => {
        let svg = document.getElementsByTagName('svg')[0]
        let rect = svg.getBoundingClientRect()
        let width = rect.width
        let height = rect.height

        dispatch({type: 'SET_SVGDIMENSIONS', payload: {width, height}})
    }

    // D3 code
    useEffect(() => {
        if (!loading && data) {
            dispatch({type: 'SET_TREE', payload: data.descendent})
            // let temp = {
            //     persons: [{personId: "5e5373a07ffd4c292be15f36", name: "GGF"}],
            //     _id: "5e54cd8bbbe8e870735d0668",
            //     path: "/uploads/GGF-1582615947199.JPG"
            // }
    
            // dispatch({type: 'SET_PHOTO', payload: temp})
        }

        const svg = select(svgRef.current)

        window.addEventListener('resize', resizeListener)

        let {width, height} = state.svgDimensions

        let xScale = scaleLinear()
            .domain([0,width])
            .range([0.05*width,0.95*width])

        let yScale = scaleLinear()
            .domain([0,height])
            .range([0.05*height,0.9*height])

            
        dispatch({type: 'SET_SVGREF', payload: svg})

        const root = hierarchy(state.tree)
        const treeLayout = tree().size([width, height])
        treeLayout(root)
        
        // console.log(root)
        // console.log(root.descendants())
        // console.log(root.links())

        const linkGenerator = linkVertical()
            .x(node => xScale(node.x))
            .y(node => yScale(node.y))

        //links
        svg.selectAll('.link')
            .data(root.links())
            .join('path')
            .attr('class', 'link')
            .attr('d', linkGenerator)
            .attr('fill','none')
            .attr('stroke', 'black')

        //nodes
        svg.selectAll('.node')
            .data(root.descendants())
            .join('circle') 
            .attr('class', 'node')
            .attr('r', 6)
            .attr('fill', 'black')
            .attr('stroke-width',1)
            .attr('stroke', 'black')
            .attr('transform', d => `translate(${xScale(d.x)}, ${yScale(d.y)})`)
            .on('click', (node, idx) => {
                dispatch({
                    type: 'TOGGLE_MODAL', 
                    payload: {
                        parentId: node.data.personId,
                        parentName: node.data.name
                    }
                })
            })
  
        //labels
        svg.selectAll('.label')
            .data(root.descendants())
            .join('text')
            .text(d => d.data.name)
            .attr('class', 'label')
            .attr('font-size', 12)
            .attr('text-anchor', 'middle')
            .attr('transform', d => `translate(${xScale(d.x)},${yScale(d.y+25)})`)    
            

        return () => {
            window.removeEventListener('resize', resizeListener)
        }
    }, [state.tree, state.svgDimensions, data])
    
    return (
        <>
            <svg ref={svgRef}></svg>
            {state.parent ? <Modal/> : null}
        </>

    )
}

export default Tree