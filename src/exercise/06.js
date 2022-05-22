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

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       hasError: false,
//     }
//   }

//   static getDerivedStateFromError(error) {
//     return {hasError: true}
//   }

//   componentDidCatch(error, errorInfo) {
//     console.log({error, errorInfo})
//   }

//   render() {
//     if (this.state.hasError) {
//       return <h1>Something went really wrong </h1>
//     } else {
//       return this.props.children
//     }
//   }
// }

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
    throw state.error // handled by an error boundary
  } else if (state.status === 'resolved') {
    return <PokemonDataView pokemon={state.pokemon} />
  } else if (state.status === 'pending') {
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
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
