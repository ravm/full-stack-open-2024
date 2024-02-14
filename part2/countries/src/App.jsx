import { useEffect, useState } from 'react'
import countryService from './services/countries'

const Countries = ({ countries, filter }) => {
  return (
    <div>
      {countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()) || filter === '')
      .map(country => <p key={country.cca3}>{country.name.common}</p>)}
    </div>
  )
}

const FilterCountries = ({ filter, handleFilterChange }) => {
  return (
    <div>
      find countries <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
      .catch(err => {
        console.log(`Error fetching countries: ${err}`)
      })
  }, [])

  const handleFilterChange = event => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <FilterCountries filter={filter} handleFilterChange={handleFilterChange} />
      <Countries countries={countries} filter={filter} />
    </div>
  )
}

export default App
