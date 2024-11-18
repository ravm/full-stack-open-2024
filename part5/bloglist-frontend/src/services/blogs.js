import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  }
  const res = await axios.get(baseUrl, config);
  return res.data;
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const res = await axios.post(baseUrl, newObject, config);
  return res.data;
}

const update = async (updatedObject) => {
  const objectUrl = `${baseUrl}/${updatedObject.id}`;
  const config = {
    headers: { Authorization: token },
  }
  const res = await axios.put(objectUrl, updatedObject, config);
  return res.data;
}

export default { setToken, getAll, create, update };
