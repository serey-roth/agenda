import * as projectsAPI from '../../api/projects'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const getCurrentProject = createAsyncThunk('projects/fetchCurrent',
async (title) => {
    try {
        const { data } = await projectsAPI.fetchCurrent(title);
        return data;
    } catch(error) {
        console.log(error);
    }
})

/* export const createTaskInProject = createAsyncThunk('projects/createTask',
async ({title, newTask}) => {
    try {
        const { data } = await projectsAPI.createTask(title, newTask);
        return data;
    } catch(error) {
        console.log(error.message);
    }   
})

export const deleteTaskInProject = createAsyncThunk('projects/deleteTask', 
async ({id, title}) => {
    try {
        await projectsAPI.deleteTask(id, title);
        return id;
    } catch(error) {
        console.log(error.message);
    }   
})

export const updateTaskInProject = createAsyncThunk('projects/updateTask', 
async ({id, title, updatedTask}) => {
    try {
        const { data } = await projectsAPI.updateTask(id, title, updatedTask);
        return data;
    } catch(error) {
        console.log(error.message);
    }   
})

export const duplicateTaskInProject = createAsyncThunk('projects/duplicateTask',
async ({id, title}) => {
    try {
        const { data } = await projectsAPI.duplicateTask(id, title);
        return data;
    } catch(error) {
        console.log(error.message);
    }  
})

export const updateTaskStatusInProject = createAsyncThunk('projects/updateTaskStatus', 
async ({title, info}) => {
    try {
        const { data } = await projectsAPI.updateTaskStatus(title, info);
        return data;
    } catch(error) {
        console.log(error.message);
    }   
}) */