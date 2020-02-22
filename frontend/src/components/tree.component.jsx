import React, {useRef, useEffect, useContext} from 'react'
import { RootContext } from '../App'
import { select, hierarchy, tree, linkVertical, scaleLinear } from 'd3'
import axios from 'axios'
import Modal from "./modal2.component.jsx"
import './tree.styles.css'

const Tree = () => {
    const svgRef = useRef()
    const {state, dispatch} = useContext(RootContext)

    // get Family Tree
    useEffect(()=> {
        axios.get('/trees')
            .then(res => {
                // should only be one tree
                dispatch({type: 'SET_TREE', payload: res.data[0]})
                
                // i don't understand why the GGF node is black. should be red whenever page refresh
                let data = {
                    persons: [{personId: "5e48fb061c9d440000743f79", name: "GGF"}],
                    _id: "5e4bbfdd56a81a72d9e528ca",
                    path: "/uploads/GGF-1582022621719.JPG"
                }
        
                dispatch({type: 'SET_PHOTO', payload: data})
            })
    }, [])

    // D3 code
    let height = 500;
    let width = 500;

    let svgEle = document.getElementsByTagName('svg')[0]
    if (svgEle) {
        let rect = svgEle.getBoundingClientRect()
        width = rect.width
        height = rect.height
    }

    let xScale = scaleLinear()
        .domain([0,width])
        .range([0.05*width,0.95*width])

    let yScale = scaleLinear()
        .domain([0,height])
        .range([0.05*height,0.95*height])


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
            .attr('r', 7)
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
            
    }, [state.tree])
    
    return (
        <div id='main-right'>
            <svg ref={svgRef}></svg>
            {state.parent ? <Modal/> : null}
        </div>

    )
}

export default Tree