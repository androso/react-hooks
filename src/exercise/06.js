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
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    let controller = new AbortController()

    if (!pokemonName) {
      return
    }
    setPokemon(null)
    setError(null)

    fetchPokemon(pokemonName, 1500, controller)
      .then(pokemonData => setPokemon(pokemonData))
      .catch(error => {
        if (error.name === 'AbortError') {
          console.log('Fetch cancelled !')
        } else {
          setError(error)
        }
      })

    return () => {
      console.log('unmounting fetch effect')
      controller.abort()
    }
  }, [pokemonName])

  if (!pokemonName) {
    return 'submit a pokemon'
  } else if (error) {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  } else if (pokemon) {
    return <PokemonDataView pokemon={pokemon} />
  } else {
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
