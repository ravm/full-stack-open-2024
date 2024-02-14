import { useEffect, useState } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const Countries = ({ countries, filter, handleSelectedCountry, selectedCountry }) => {
  if (selectedCountry) {
    return null
  }

  const filteredCountries = countries.filter(country => country.name.common.toLowerCase()
  .includes(filter.toLowerCase()) || filter === '')

  const queriedCountries = filteredCountries.map(country => <p key={country.cca3}>
  {country.name.common} <button key={country.cca3} onClick={() => handleSelectedCountry(country)}>show</button></p>)

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
    return (
      <div>
        <DisplayCountry country={country} />
      </div>
    )
  }
}

const DisplayCountry = ({ country }) => {
  const weather = weatherService.getWeather(country.capital)
  console.log(weather)
  return (
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
          <div>
            <h2>Weather in {country.capital}</h2>
          </div>
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
  const [selectedCountry, setSelectedCountry] = useState(null)

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
    setSelectedCountry(null)
  }

  const handleSelectedCountry = country => {
    setSelectedCountry(country)
  }

  return (
    <div>
      <FilterCountries filter={filter} handleFilterChange={handleFilterChange} />
      <Countries countries={countries} filter={filter}
      handleSelectedCountry={handleSelectedCountry} selectedCountry={selectedCountry} />
      {selectedCountry && <DisplayCountry country={selectedCountry} />}
    </div>
  )
}

export default App
