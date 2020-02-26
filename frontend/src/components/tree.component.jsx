import React, {useRef, useEffect, useContext} from 'react'
import { RootContext } from '../App'
import { select, hierarchy, tree, linkVertical, scaleLinear } from 'd3'
import Modal from "./modal2.component.jsx"
import {useQuery} from '@apollo/react-hooks'
import {getGGFQuery} from '../graphQL/queries'

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

    useEffect(() => {
        if (!loading && data) {
            // if (!state.photo.id) {
            //     let temp = {
            //         persons: [{id: "5e5373a07ffd4c292be15f36", name: "GGF"}],
            //         id: "5e54db081ac47083042c96db",
            //         path: "/uploads/GGF-1582619400013.JPG"
            //     }
            //     dispatch({type: 'SET_PHOTO', payload: temp})
            // }

        // D3 code
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

        const root = hierarchy(data.descendent)
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
                        selectedId: node.data.id,
                        selectedName: node.data.name,
                        parentId: node.parent ? node.parent.data.id : null,
                        parentName: node.parent ? node.parent.data.name : null,
                    }
                })
            })
  
        //labels
        svg.selectAll('.label')
            .data(root.descendants())
            .join('text')
            .text(d => d.data.name)
            .attr('class', 'label')
            .attr('font-size', 10)
            .attr('text-anchor', 'middle')
            .attr('transform', d => `translate(${xScale(d.x)},${yScale(d.y+25)})`)    
        }

        return () => {
            window.removeEventListener('resize', resizeListener)
        }
    }, [state.svgDimensions, state.photo, data])
    
    return (
        <>
            <svg ref={svgRef}></svg>
            {state.parent ? <Modal/> : null}
        </>

    )
}

export default Tree