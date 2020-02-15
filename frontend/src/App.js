import React, {useReducer, useEffect, createContext} from "react";
import Photo from "./components/photo.component";
import File from "./components/file.component";
import Tag from "./components/tag.component";
import Tree from './components/tree.component'
import Album from './components/album.component'
import './App.styles.css'
import axios from "axios";

export const RootContext = createContext()

const initialState = { 
  file: null,
  photo: {
    path: null,
    persons: []
  },
  album: [],
  tree: {
    name: 'GGF',
    children: [
        {
            name: '1stSon',
            children: []
        },
        {
            name: '2ndSon',
            children: []
        },
        {
            name: '3rdSon',
            children: []
        },
        {
            name: '4thSon',
            children: [
                {
                    name: 'Mary',
                    children: []
                },
                {
                    name: 'Louis',
                    children: []
                },
                {
                    name: 'Danny',
                    children: []
                },
                {
                    name: 'Michael',
                    children: []
                },
            ]
        },
        {
            name: '5thSon',
            children: []
        },
        {
            name: '6thSon',
            children: []
        },
        {
            name: '1stDaughter',
            children: []
        },
        {
            name: '7thSon',
            children: []
        }
    ]
  }
}

const reducer = (state,action) => {
  switch (action.type) {
      case 'FETCH_ALBUM':
          return {
              ... state,
              album: action.payload
          }
      case 'SET_FILE':
          return {
              ... state,
              file: action.payload
          }
      case 'SET_PHOTO':
          return {
              ... state,
              photo: action.payload
          }
      default:
          return state
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  // get Family Tree
  useEffect(()=> {
    console.log('loktar!')
    axios.get('/trees')
      .then(res => console.log(res.body))
  },[])

  return (
    <RootContext.Provider id='root' value={{state, dispatch}}>
      <File/>
      <Photo/>
      <Tag/>
      <Tree />
      <Album/>
    </RootContext.Provider>
  );
}

export default App;


