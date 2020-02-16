import React, {useState, useEffect, useRef, useContext} from 'react'
import { RootContext } from '../App'
import { select, hierarchy, tree, linkVertical } from 'd3'
import axios from 'axios'

// const useResizeObserver = ref => {
//     const [dimensions, setDimensions] = useState(null);
//     useEffect(() => {
//         const observeTarget = ref.current
//         const resizeObserver = new resizeObserver(entries => {
            
//         }) 

//         resizeObserver.observe(observeTarget)
//         return () => {
//             resizeObserver.unobserve(observeTarget)
//         };
//     },[ref])
//     return dimensions
// }


const Tree = () => {
    const svgRef = useRef()

    const {state, dispatch} = useContext(RootContext)


    useEffect(() => {
        const svg = select(svgRef.current)
        const root = hierarchy(state.tree)
        const treeLayout = tree().size([600, 600])
        treeLayout(root)

        console.log(root.descendants())
        console.log(root.links())

        const linkGenerator = linkVertical()
            .x(node => node.x)
            .y(node => node.y)

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
            .attr('r', 5)
            .attr('fill', 'black')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)

        // labels
        svg.selectAll('.labels')
            .data(root.descendants())
            .join('text')
            .attr('class', 'label')
            .text(node => node.data.name)
            .attr('text-anchor', 'middle')
            .attr('font-size', 12)
            .attr('x', node => node.x)
            .attr('y', node => node.y+20)
            
    }, [state.tree])

    return (
        <>
            Name:
            <input type='text' />
            <svg ref={svgRef}>
            </svg>
        </>
    )
}

export default Tree