import axios from 'axios'

const url = 'http://localhost:5000/projects'

export const fetchCurrent = (title) =>  axios.get(`${url}/${title}`);