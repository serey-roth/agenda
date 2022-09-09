import * as api from '../../api/index'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const getCurrentProject = createAsyncThunk('projects/fetchCurrent',
async (title) => {
    try {
        const { data } = await api.fetchCurrentProject(title);
        return data;
    } catch(error) {
        console.log(error);
    }
})

export const getProjectNames = createAsyncThunk('projects/fetchNames',
async (title) => {
    try {
        const { data } = await api.fetchProjectNames(title);
        return data;
    } catch(error) {
        console.log(error);
    }
})