import { useState } from 'react'

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array.apply(null, new Array(anecdotes.length)).map(Number.prototype.valueOf, 0))

  const RandomQuote = () => {
    let index = Math.floor(Math.random() * anecdotes.length)
    setSelected(index)
    return selected
  }

  const VoteCounter = () => {
    let copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const MostVotes = () => {
    let maxIndex = votes.indexOf(Math.max(...votes))
    return maxIndex
  }

  return (
    <div>
      <div>
        <h1>Anecdote of the day</h1>
        {anecdotes[selected]}
        <p>has {votes[selected]} votes</p>
      </div>
      <Button handleClick={VoteCounter} text={"vote"}></Button>
      <Button handleClick={RandomQuote} text={"next anecdote"} />
      <div>
        <h1>Anecdote with most votes</h1>
        {anecdotes[MostVotes()]}
        <p>has {votes[MostVotes()]} votes</p>
      </div>
    </div>
  )
}

export default App
