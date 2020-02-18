import React, { useReducer, createContext } from "react";
import Photo from "./components/photo.component";
import File from "./components/file.component";
import Tag from "./components/tag.component";
import Tree from './components/tree.component'
import Album from './components/album.component'
import Modal from './components/modal.component'

import './App.css'

export const RootContext = createContext()

const initialState = { 
  file: null,
  photo: {
    _id: null,
    path: null,
    persons: []
  },
  album: [],
  parent: null,
  tree: {
    treeId: null,
    personId: null,
    name: '',
    children: []
  },
  svgRef: null,
  modal: false
}

const reducer = (state,action) => {
  switch (action.type) {
      case 'FETCH_ALBUM':
        return { ...state, album: action.payload };
      case 'SET_FILE':
        return { ...state, file: action.payload };
      case 'SET_PHOTO':
        return {
          ...state,
          photo: action.payload
        }
      case 'SET_TREE':
        return {
          ...state,
          tree: action.payload
        }
      case 'TOGGLE_MODAL':
        return {
          ...state,
          modal: !state.modal,
          parent: !state.modal ? action.payload : null
        }
      case 'SET_SVGREF':
        return {
          ...state,
          svgRef: action.payload
        }
      default:
          return state
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  // const [x, setX] = useState(window.innerWidth)
  // const [y, setY] = useState(window.innerHeight)

  // const updateDimensions = () => {
  //   setX(window.innerWidth)
  //   setY(window.innerHeight)
  //   console.log(window.innerWidth, window.innerHeight)
  //   console.log(x, y)
  // }

  // useEffect(() => {
  //   window.addEventListener('resize', updateDimensions)
  // }, [])

  return (
    <RootContext.Provider id='root' value={{state, dispatch}}>
        { state.modal ? <Modal/> : null }
        <div id='project-title'>Chou Family Tree and Photos</div>
        <File/>

        <div id='photo-section'>
          <Photo/>
          <Album/>
        </div>
        
        <Tag/>
        <Tree />
    </RootContext.Provider>
  );
}

export default App;


