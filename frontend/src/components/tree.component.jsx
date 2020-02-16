import React, {useState, useEffect, useRef, useContext} from 'react'
import { RootContext } from '../App'
import { select, hierarchy, tree, linkVertical, scaleLinear } from 'd3'
import axios from 'axios'

const Tree = () => {
    const svgRef = useRef()
    const {state, dispatch} = useContext(RootContext)

    useEffect(() => {
        const height = 500, width = 500
        
        const svg = select(svgRef.current)

        svg
            .attr('width', width)
            .attr('height', height)

        let scale = scaleLinear()
            .domain([0,height])
            .range([25,475])

        const root = hierarchy(state.tree)
        const treeLayout = tree().size([width, height])
        treeLayout(root)
        
        console.log(root)
        console.log(root.descendants())
        console.log(root.links())

        const linkGenerator = linkVertical()
            .x(node => scale(node.x))
            .y(node => scale(node.y))

        //links
        svg.selectAll('link')
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
            .attr('r', 7.5)
            .attr('fill', 'black')
            .attr('transform', d => `translate(${scale(d.x)}, ${scale(d.y)})`)

        // labels
        svg.selectAll('.labels')
            .data(root.descendants())
            .join('text')
            .attr('class', 'label')
            .text(node => node.data.name)
            .attr('text-anchor', 'middle')
            .attr('font-size', 12)
            .attr('x', node => scale(node.x))
            .attr('y', node => scale(node.y)+20)
            
    }, [state.tree])

    return (
        <>
            Name:
            <input type='text' />
            <svg ref={svgRef} >
            </svg>
        </>
    )
}

export default Tree