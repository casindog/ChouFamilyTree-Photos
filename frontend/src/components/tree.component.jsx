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
    let height = 250, width = 1000

    let xScale = scaleLinear()
        .domain([0,width])
        .range([25,width-25])

    let yScale = scaleLinear()
        .domain([0,height])
        .range([25,height-25])


    useEffect(() => {
        const svg = select(svgRef.current)

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
                console.log(node)
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
            .attr('transform', d => `translate(${xScale(d.x)},${yScale(d.y+25)})`)    
            
    }, [state.tree])

    return (
        <svg ref={svgRef} width={width} height={height}></svg>
    )
}

export default Tree