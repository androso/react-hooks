// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState(() => ({
    status: 'idle',
    pokemon: null,
    error: null,
  }))

  React.useEffect(() => {
    let controller = new AbortController()
    if (!pokemonName) {
      return
    }

    
    setState({...state, status: 'pending'})

    fetchPokemon(pokemonName, 1500, controller)
      .then(pokemonData => {
        
        setState({...state, status: 'resolved', pokemon: pokemonData})
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          console.log('Fetch cancelled !')
        } else {
          
          setState({...state, error, status: 'rejected'})
        }
      })

    return () => {
      controller.abort()
    }
  }, [pokemonName])

  if (state.status === 'idle') {
    return 'submit a pokemon'
  } else if (state.status === 'rejected') {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{state.error.message}</pre>
      </div>
    )
  } else if (state.status === 'resolved') {
    return <PokemonDataView pokemon={state.pokemon} />
  } else if (state.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
