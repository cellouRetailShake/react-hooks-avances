// Hook Perso
// http://localhost:3000/alone/exercise/02.js

/* eslint-disable no-unused-vars */
import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  fetchMarvel,
  MarvelPersoView,
  MarvelSearchForm,
  ErrorDisplay,
  fetchMarvelsList,
} from '../marvel'
import '../02-styles.css'

// 🐶 créé un hook personnalisé 'useMarvelExist' qui va appeler l'api.
// Ce hook retournera le state 'exist' à true si api retourne un marvel`
// Il retournera  à false si 'fetchMarvel' lève une erreur
function useMarvelExist(marvelName) {
  const [exist, setExist] = React.useState(false)

  React.useEffect(() => {
    if (!marvelName) {
      return
    }
    fetchMarvel(marvelName)
    .then(() => setExist(true))
    .catch(() => setExist(false))
  }, [marvelName])

  return exist
}

const reducer = (state, action) => {  
  switch (action.type) {
    case 'fetching':
      return {marvel: null, error: null, status: 'fetching'}
    
    case 'done': 
      return {marvel: action.payload, error: null, status: 'done'}
    
    case 'error': 
      return {marvel: null, error: action.error, status: 'error'}
    
    default: 
      throw new Error(`Unsupported action type: ${action.type}`)
  }
}

function useFetchData(marvelName,fetch) {
  const [state, dispatch] = React.useReducer(reducer,{
    marvel: null,
    status: null,
    error: null,
  })
  React.useEffect(() => {
    if (!marvelName) {
      return
    }
    dispatch({type: 'fetching'})
    fetch(marvelName)
    .then((marvel) => dispatch({type: 'done', payload: marvel}))
    .catch((error) => dispatch({type: 'fail', error}))
  }, [marvelName,fetch])
 
  return state
}

function useFindMarvelByName(marvelName) {
  return useFetchData(marvelName,fetchMarvel)
}

function useFindMarvelList (marvelName) {
  return useFetchData(marvelName,fetchMarvelsList)
}

function Marvel({marvelName}) {
  const {marvel, error, status} = useFindMarvelByName(marvelName)
  if(status ==='fail') { 
    throw error
  } else if (status === 'idle') {
    return 'enter un nom de Marvel'
  } else if (status === 'fetching') {
    return 'chargement en cours ...'
  } else if (status === 'done') {
    return <MarvelPersoView marvel={marvel} />
  }
  return null
}

function MarvelList({marvelName}) {
  const {marvel, error, status} = useFindMarvelList(marvelName)
  if(status ==='fail') { 
    throw error
  } else if (status === 'idle') {
    return 'enter un nom de Marvel'
  }
  else if (status === 'fetching') {
    return 'chargement en cours ...'
  } else if (status === 'done') {
    return (
      <ul>
        {marvel.map((marvel) => (
          <li key={marvel.id}>
            <MarvelPersoView marvel={marvel} />
          </li>
        ))}
      </ul>
    )
  }
  return null 
}


function App() {
  const [marvelName, setMarvelName] = React.useState('')
  const [searchList, setSearchList] = React.useState('')
  const handleSearch = name => {
    setMarvelName(name)
  }
  return (
    <div className="marvel-app">
      <input type='checkbox' id='searchList' checked={searchList} onChange={() => setSearchList(!searchList)} />
      <label htmlFor='searchList'> Chercher une liste ?</label>
      <MarvelSearchForm marvelName={marvelName} onSearch={handleSearch} />
      <div className="marvel-detail">
        <ErrorBoundary key={marvelName} FallbackComponent={ErrorDisplay}>
        {searchList ? (
          <MarvelList marvelName={marvelName} />
        ) : (
          <Marvel marvelName={marvelName} />
        )}
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
