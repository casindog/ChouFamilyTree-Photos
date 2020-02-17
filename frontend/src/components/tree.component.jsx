import React, {useRef, useEffect, useContext} from 'react'
import { RootContext } from '../App'
import { select, hierarchy, tree, linkVertical, scaleLinear } from 'd3'
import axios from 'axios'

const Tree = () => {
    const svgRef = useRef()
    const {state, dispatch} = useContext(RootContext)

    // get Family Tree
    useEffect(()=> {
        axios.get('/trees')
            .then(res => {
                // should only be one tree
                dispatch({type: 'SET_TREE', payload: res.data[0]})
            })
    }, [])

    // D3 code
    let height = 500, width = 500

    let scale = scaleLinear()
        .domain([0,height])
        .range([25,475])


    useEffect(() => {
        const svg = select(svgRef.current)
        const root = hierarchy(state.tree)
        const treeLayout = tree().size([width, height])
        treeLayout(root)
        
        // console.log(root)
        // console.log(root.descendants())
        // console.log(root.links())

        const linkGenerator = linkVertical()
            .x(node => scale(node.x))
            .y(node => scale(node.y))

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
            .attr('r', 7.5)
            .attr('fill', 'black')
            .attr('transform', d => `translate(${scale(d.x)}, ${scale(d.y)})`)
            .on('click', (node, idx) => {
                // console.log(node)
                // console.log(idx)
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
            .attr('transform', d => `translate(${scale(d.x)},${scale(d.y)+20})`)    
            
    }, [state.tree])

    return (
        <svg ref={svgRef} width={width} height={height}></svg>
    )
}

export default Tree