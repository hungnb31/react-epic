// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

class ErrorBoundary extends React.Component {
  state = {error: null}
  static getDerivedStateFromError(error) {
    return {error}
  }

  render() {
    const {error} = this.state
    if (error) {
      return <this.props.FallbackComponent error={error} />
    }
    return this.props.children
  }
}

function ErrorFallback({error}) {
  return (
    <div role="alert">
      There was an error:
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  const [{status, pokemon, error}, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setState({status: 'pending'})
    fetchPokemon(pokemonName)
      .then(pokemon => {
        setState({pokemon, status: 'resolved'})
      })
      .catch(error => {
        setState({error, status: 'rejected'})
      })
  }, [pokemonName])

  if (status === 'rejected') {
    throw error
  } else if (status === 'idle') {
    return 'Submit a Pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
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
        <ErrorBoundary key={pokemonName} FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
