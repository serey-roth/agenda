import * as api from '../../api/index'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const getTasks = createAsyncThunk('tasks/fetchTasks', 
async () => {
    try {
        const { data } = await api.fetchTasks();
        console.log(data)
        return data;
    } catch(error) {
        console.log(error);
    }   
})

export const createTask = createAsyncThunk('tasks/createTask', 
async (newTask) => {
    try {
        const { data } = await api.createTask(newTask);
        return data;
    } catch(error) {
        console.log(error.message);
    }   
})

export const deleteTask = createAsyncThunk('tasks/deleteTask', 
async (id) => {
    try {
        await api.deleteTask(id);
        return id;
    } catch(error) {
        console.log(error.message);
    }   
})

export const updateTask = createAsyncThunk('tasks/updateTask', 
async ({id, updatedTask}) => {
    try {
        const { data } = await api.updateTask(id, updatedTask);
        return data;
    } catch(error) {
        console.log(error.message);
    }   
})

export const duplicateTask = createAsyncThunk('tasks/duplicateTask',
async (id) => {
    try {
        const { data } = await api.duplicateTask(id);
        return data;
    } catch(error) {
        console.log(error.message);
    }  
})