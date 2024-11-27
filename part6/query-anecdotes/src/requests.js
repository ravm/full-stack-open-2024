import axios from "axios";

export const getAnecdotes = async () => {
  return (await axios.get("http://localhost:3001/anecdotes")).data;
}
