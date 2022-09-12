import * as api from '../../api/index'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const getCurrentProject = createAsyncThunk('projects/fetchCurrent',
async ({title, sortBy}) => {
    try {
        const { data } = await api.fetchCurrentProject(title, sortBy);
        return data;
    } catch(error) {
        console.log(error);
    }
})

export const getProjectNames = createAsyncThunk('projects/fetchNames',
async () => {
    try {
        const { data } = await api.fetchProjectNames();
        return data;
    } catch(error) {
        console.log(error);
    }
})


export const addProject = createAsyncThunk('projects/addProject',
async (project) => {
    try {
        const { data } = await api.addProject(project);
        return data.project;
    } catch(error) {
        console.log(error);
    }
})