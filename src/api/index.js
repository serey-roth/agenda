import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
    const user = localStorage.getItem('currentUser')
    if (user) {
        req.headers.Authorization =  `Bearer ${JSON.parse(user).token}`
    }
    return req;
})

//tasks
export const fetchTasks = () =>  API.get('/tasks');

export const createTask = (newTask) => API.post('/tasks', newTask);

export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export const updateTask = (id, updatedTask) =>
API.patch(`/tasks/${id}`, updatedTask);

export const duplicateTask = (id) => API.post(`/tasks/${id}`);

//projects
export const fetchCurrentProject = (title, sortBy) =>  API.get(`/projects/${title}/${sortBy}`);

export const fetchProjectNames = () => API.get('/projects');

export const addProject = (project) => API.post('/projects', project);

//users
export const signIn = (data) => API.post('/users/signIn', data);

export const signUp = (data) => API.post('/users/signUp', data);

export const googleSignIn = (data) => API.post('/users/googleSignIn', data);
