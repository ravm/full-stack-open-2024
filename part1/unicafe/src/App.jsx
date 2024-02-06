import { useState } from 'react'

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const Statistics = ({good, neutral, bad, avg}) => {
  const total = good + neutral + bad
  const totalGood = (good / total) * 100

  if (total === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  return (
    <div>
      <StatisticsLine text="good" value={good} />
      <StatisticsLine text="neutral" value={neutral} />
      <StatisticsLine text="bad" value={bad} />
      <StatisticsLine text="all" value={total} />
      <StatisticsLine text="average" value={total > 0 ? avg / total : 0} />
      <StatisticsLine text="positive" value={total > 0 ? totalGood : 0} />
    </div>
  )
}

const StatisticsLine = ({text, value}) => {
  return (
    <p>
      {text} {text === "positive" ? `${value} %` : value}
    </p>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [avg, setAvg] = useState(0)

  const handleGood = () => {
    setGood(good + 1)
    setAvg(avg + 1)
  }

  const handleNeutral = () => {
    setNeutral(neutral + 1)
    setAvg(avg + 0)
  }

  const handleBad = () => {
    setBad(bad + 1)
    setAvg(avg - 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGood} text={'good'} />
      <Button handleClick={handleNeutral} text={'neutral'} />
      <Button handleClick={handleBad} text={'bad'} />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} avg={avg}/>
    </div>
  )
}

export default App
