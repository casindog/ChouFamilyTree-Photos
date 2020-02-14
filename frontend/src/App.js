import React, {useReducer, useEffect, createContext} from "react";
import Photo from "./components/photo.component";
import File from "./components/file.component";
import Tag from "./components/tag.component";
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
  tree: {}
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
      <Album/>

    </RootContext.Provider>

  );
}

export default App;


