import React, {useReducer, createContext} from "react";
import Photo from "./components/photo.component";

export const RootContext = createContext()

const initialState = { 
  file: null,
  photo: null,
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

  return (
    <RootContext.Provider value={{state, dispatch}}>
      <h1>Chou Family Tree and Photos</h1>
      <Photo/>
    </RootContext.Provider>

  );
}

export default App;


