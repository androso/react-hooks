// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState(() => ({
    status: 'idle',
    pokemon: null,
    error: null,
  }))
  const {status, pokemon, error} = state;
  console.log('rendering PokemonInfo')
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

  if (status === 'idle') {
    return 'submit a pokemon'
  } else if (status === 'rejected') {
    throw error // handled by an error boundary
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}
function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }
  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
