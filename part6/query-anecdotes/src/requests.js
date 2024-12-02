import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

export const getAnecdotes = async () => {
  return (await axios.get(baseUrl)).data;
}

export const createAnecdote = async (newAnecdote) => {
  return (await axios.post(baseUrl, newAnecdote)).data;
}

export const updateAnecdote = async (anecdote) => {
  return (await axios.put(`${baseUrl}/${anecdote.id}`, anecdote)).data;
}
