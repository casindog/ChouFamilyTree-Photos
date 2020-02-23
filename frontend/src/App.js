import React, { useReducer, createContext } from "react";
import Photo from "./components/photo.component";
import File from "./components/file.component";
import Tree from './components/tree.component'
import Album from './components/album.component'
import Tag from './components/tag.component'

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
          modal: !!action.payload,
          parent: action.payload
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

  return (
    <RootContext.Provider id='root' value={{state, dispatch}}>
        {/* { state.modal ? <Modal/> : null } */}
        <div id='main'>
          <div id='title-right' >Chou Family Tree</div>

          <File/>
          <Photo/>
          <Tag/>
          <Tree />
          <Album/>
        </div>
        
    </RootContext.Provider>
  );
}

export default App;


