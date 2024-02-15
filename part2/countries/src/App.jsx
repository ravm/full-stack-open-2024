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
    handleSelectedCountry(country)
    return null
  }
}

const DisplayCountry = ({ country, weather }) => {
  if (!weather) {
    return <p>Loading..</p>;
  }
  
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
            <p>temperature {weather.main.temp} Celcius </p>
            <picture>
              <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
            </picture>
            <p>wind {weather.wind.speed} m/s</p>
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
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    if (selectedCountry) {
      setLoading(true)
      weatherService
        .getWeather(selectedCountry.capital)
        .then(weatherData => {
          setWeather(weatherData)
          setLoading(false)
        })
        .catch(err => {
          console.log(`Error fetching weather data: ${err}`)
          setLoading(false)
        })
    }
  }, [selectedCountry])

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
      <Countries
        countries={countries}
        filter={filter}
        handleSelectedCountry={handleSelectedCountry}
        selectedCountry={selectedCountry}
      />
      {selectedCountry && (!loading ? <DisplayCountry country={selectedCountry} weather={weather} /> : <p>Loading..</p>)}
    </div>
  )
}

export default App
