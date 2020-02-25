import React, {useRef, useEffect, useContext} from 'react'
import { RootContext } from '../App'
import { select, hierarchy, tree, linkVertical, scaleLinear } from 'd3'
import axios from 'axios'
import Modal from "./modal2.component.jsx"


const Tree = () => {
    const svgRef = useRef()
    const {state, dispatch} = useContext(RootContext)

    useEffect(()=> {
        axios.get('/trees')
            .then(res => {
                // should only be one tree
                dispatch({type: 'SET_TREE', payload: res.data[0]})
                
                let data = {
                    persons: [{personId: "5e48fb061c9d440000743f79", name: "GGF"}],
                    _id: "5e4bbfdd56a81a72d9e528ca",
                    path: "/uploads/GGF-1582022621719.JPG"
                }
        
                dispatch({type: 'SET_PHOTO', payload: data})
            })

    }, [])

    const resizeListener = () => {
        let svg = document.getElementsByTagName('svg')[0]
        let rect = svg.getBoundingClientRect()
        let width = rect.width
        let height = rect.height

        dispatch({type: 'SET_SVGDIMENSIONS', payload: {width, height}})
    }

    useEffect(()=> {

    }, [state.svgDimensions])
    // D3 code
    useEffect(() => {
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
            

        return () => {
            window.removeEventListener('resize', resizeListener)
        }
    }, [state.tree, state.svgDimensions])
    
    return (
        <>
            <svg  ref={svgRef}></svg>
            {state.parent ? <Modal/> : null}
        </>

    )
}

export default Tree