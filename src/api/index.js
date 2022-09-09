import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:5000' });

//tasks
export const fetchTasks = () =>  API.get('/tasks');

export const createTask = (newTask) => API.post('/tasks', newTask);

export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export const updateTask = (id, updatedTask) =>
API.patch(`/tasks/${id}`, updatedTask);

export const duplicateTask = (id) => API.post(`/tasks/${id}`);

//projects
export const fetchCurrentProject = (title) =>  API.get(`/projects/${title}`);

export const fetchProjectNames = () => API.get('/projects');

//users
export const signIn = (data) => API.post('/users/signIn', data);

export const signUp = (data) => API.post('/users/signUp', data);