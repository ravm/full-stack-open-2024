import { useEffect, useState } from 'react'
import countryService from './services/countries'

const Countries = ({ countries, filter }) => {
  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()) || filter === '')
  const queriedCountries = filteredCountries.map(country => <p key={country.cca3}>{country.name.common}</p>)

  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (filteredCountries.length > 1) {
    return (
      <div>
        {queriedCountries}
      </div>
    )
  } else if (filteredCountries.length === 1) {
      const country = filteredCountries[0];
      const countryInfo = (
        <div>
          <h1>{country.name.common}</h1>
          <p>capital {country.capital}</p>
          <p>area {country.area}</p>
          <strong>languages:</strong>
          <ul>
            {Object.keys(country.languages).map((lang, i) => (
              <li key={i}>{country.languages[lang]}</li>
            ))}
          </ul>
          <picture>
            <img src={country.flags.svg} width={150} />
          </picture>
        </div>
      )

    return (
      <div>
        {countryInfo}
      </div>
    )
  }
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
