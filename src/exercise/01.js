// useReducer
// http://localhost:3000/alone/exercise/01.js

/* eslint-disable no-unused-vars */
import * as React from 'react'


const reducer = (state, action) => {
  switch(action.type){
    case 'DECREMENT': {
      return {
        ...state,
        count: state.count - action.payload
      }
    }
    case 'INCREMENT': {
      return {
        ...state,
        count: state.count + action.payload
      }
    }
    case 'RESET': {
      return {count:0}
    }
    default : {
      throw Error('Unknown action.');
    }
  }
}


function Compteur() {
  const [state, dispatch] = React.useReducer(reducer,{ count: 0 })
  const [payload, setPayload] = React.useState(0)
  function increment() {
    dispatch({type: 'INCREMENT',payload});
  }
  function decrement() {
    dispatch({type: 'DECREMENT',payload});
  }
  function reset() {
    dispatch({type: 'RESET'});
  }

  return (
    <>
    <input type="number" onChange={(e) => setPayload(parseInt(e.target.value))} value={payload} />
    <input type="button" onClick={decrement} value={'-'} />
    {state.count}
    <input type="button" onClick={increment} value={'+'} />
    <input type="button" onClick={reset} value={'Zero'} />
    </>
  )
}

function App() {
  return <Compteur />
}

export default App
