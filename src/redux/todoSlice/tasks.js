import * as tasksAPI from '../../api/tasks'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const getTasks = createAsyncThunk('tasks/fetchTasks', 
async () => {
    try {
        const { data } = await tasksAPI.fetchTasks();
        console.log(data)
        return data;
    } catch(error) {
        console.log(error);
    }   
})

export const createTask = createAsyncThunk('tasks/createTask', 
async (newTask) => {
    try {
        const { data } = await tasksAPI.createTask(newTask);
        return data;
    } catch(error) {
        console.log(error.message);
    }   
})

export const deleteTask = createAsyncThunk('tasks/deleteTask', 
async (id) => {
    try {
        await tasksAPI.deleteTask(id);
        return id;
    } catch(error) {
        console.log(error.message);
    }   
})

export const updateTask = createAsyncThunk('tasks/updateTask', 
async ({id, updatedTask}) => {
    try {
        const { data } = await tasksAPI.updateTask(id, updatedTask);
        return data;
    } catch(error) {
        console.log(error.message);
    }   
})

export const duplicateTask = createAsyncThunk('tasks/duplicateTask',
async (id) => {
    try {
        const { data } = await tasksAPI.duplicateTask(id);
        return data;
    } catch(error) {
        console.log(error.message);
    }  
})