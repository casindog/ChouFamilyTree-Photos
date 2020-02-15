import React, {useState, useEffect, useRef, useContext} from 'react'
import { RootContext } from '../App'
import { select } from 'd3'
import axios from 'axios'

const data = [5,10,15,20,25,30]


const Tree = () => {
    const svgRef = useRef()
    const {state, dispatch} = useContext(RootContext)

    useEffect(() => {
        const svg = select(svgRef.current)

        svg
            .selectAll('circle')
            .data(data)
            .join(
                enter => enter
                    .append('circle')
                    .attr('r', d => d)
                    .attr('cx', d => d*2)
                    .attr('cy', d => d *2),
                update => update.attr('class', 'updated'),
                exit => exit.remove()
            )
        

        // const root = hierarchy(state.tree)
        // // const treeLayout = tree().size([dimensions.width, dimensions.height])
        // // treeLayout(root)
        // console.log(root)
        // // svg.selectAll('circle').data(data)
    }, [])

    return (
        <>
            Name:
            <input type='text' />
            <svg ref={svgRef}>
                <circle></circle>
            </svg>
        </>
    )
}

export default Tree