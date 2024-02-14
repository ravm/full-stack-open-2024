import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY

const getWeather = city => {
  return axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`)
    .then(response => response.data)
    .catch(error => {
      console.error(`Error: ${error}`)
    })
}

export default { getWeather };
