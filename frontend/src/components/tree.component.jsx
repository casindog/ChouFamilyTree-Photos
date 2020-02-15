import React, {useState, useContext} from 'react'
import { RootContext } from '../App'
import axios from 'axios'

const Tree = () => {
    const [node, setNode] = useState(null)
    const {state, dispatch} = useContext(RootContext)


    return (
        <>
            <form>
                <label>
                    Name:
                    <input type='text' onChange={e => setNode(e.target.value)}/>
                </label>
            </form>
        </>
    )
}

export default Tree