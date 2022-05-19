// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'

function Board({onClick, squares}) {
  function rendersquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }
  return (
    <div>
      <div className="board-row">
        {rendersquare(0)}
        {rendersquare(1)}
        {rendersquare(2)}
      </div>
      <div className="board-row">
        {rendersquare(3)}
        {rendersquare(4)}
        {rendersquare(5)}
      </div>
      <div className="board-row">
        {rendersquare(6)}
        {rendersquare(7)}
        {rendersquare(8)}
      </div>
    </div>
  )
}

/*
[
  [move 1 sqrs], 
  [move 2 sqrs], 
  [move 3 sqrs], 
  [move 4 sqrs]
]

*/

// function Game() {
//   const [currentsquares, setCurrentsquares] = useLocalStorage(
//     'ttt:current-squares',
//     Array(9).fill(null),
//   )
//   const [history, setHistory] = useLocalStorage('ttt:moves-history', [
//     currentsquares,
//   ])
//   const [currentStepIndex, setcurrentStepIndex] = useLocalStorage(
//     'ttt:step-index',
//     0,
//   )
//   const nextValue = calculateNextValue(currentsquares)
//   const winner = calculateWinner(currentsquares)
//   const status = calculateStatus(winner, currentsquares, nextValue)

// function selectsquare(squareIndex) {
//   if (winner || currentsquares[squareIndex]) {
//     return
//   }
//   const squaresCopy = [...currentsquares]
//   squaresCopy[squareIndex] = nextValue
//   setCurrentsquares(squaresCopy)
//   setHistory([...history, squaresCopy])
//   setcurrentStepIndex(squareIndex)
// }

//   function restart() {
//     setCurrentsquares(Array(9).fill(null))
//     setcurrentStepIndex(0)
//     setHistory([Array(9).fill(null)])
//   }

//   function changeStep(stepIndex) {
//     setCurrentsquares(history[stepIndex])
//     setcurrentStepIndex(stepIndex)
//   }
//   const Moves = history.map((step, index) => {
//     const description = index ? `Go to move #${index}` : 'Go to game start'
//     const isCurrentStep = index === currentStepIndex
//     return (
//       <li key={index}>
//         <button onClick={() => changeStep(index)} disabled={isCurrentStep}>
//           {description} {isCurrentStep ? '(current)' : null}
//         </button>
//       </li>
//     )
//   })
//   return (
//     <div className="game">
//       <div className="game-board">
//         <Board onClick={selectsquare} squares={currentsquares} />
//         <button className="restart" onClick={restart}>
//           restart
//         </button>
//       </div>
//       <div className="game-info">
//         <div>{status}</div>
//         <ol>{Moves}</ol>
//       </div>
//     </div>
//   )
// }

function Game() {
  const [history, setHistory] = useLocalStorage('ttt:history', [
    Array(9).fill(null),
  ])
  const [currentStepIndex, setCurrentStepIndex] = useLocalStorage(
    'ttt:step-index',
    0,
  )

  const currentSquares = history[currentStepIndex]
  const winner = calculateWinner(currentSquares)
  const nextValue = calculateNextValue(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  const selectSquare = squareIndex => {
    if (winner || currentSquares[squareIndex]) {
      return
    }
    const newHistory = history.slice(0, currentStepIndex + 1)
    const squares = [...currentSquares]
    squares[squareIndex] = nextValue
    setHistory([...newHistory, squares])
    setCurrentStepIndex(newHistory.length)
  }

  const restart = () => {
    setHistory([Array(9).fill(null)])
    setCurrentStepIndex(0)
  }

  const moves = history.map((stepSquares, stepIndex) => {
    const description = stepIndex
      ? `Go to move #${stepIndex}`
      : 'Go to game start'
    const isCurrentStep = stepIndex === currentStepIndex
    return (
      <li key={stepIndex}>
        <button
          disabled={isCurrentStep}
          onClick={() => setCurrentStepIndex(stepIndex)}
        >
          {description} {isCurrentStep ? '(current)' : null}
        </button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars

/*
[
  'X', 'O', 'X',
  'O', 'X', 'O',
  'X', 'O', 'O'
]
*/
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

export function useLocalStorage(
  key,
  initialValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [value, setValue] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }

    return typeof initialValue === 'function' ? initialValue() : initialValue
  })
  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(value))
  }, [value, key, serialize])

  return [value, setValue]
}
function arraysAreEqual(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.every(item => b.includes(item)) && b.every(item => a.includes(item))
    )
  }
  return false
}

function App() {
  return <Game />
}

export default App
