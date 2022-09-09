import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../api/index'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        googleAuth(state, action) {
            state.user = action.payload;
            localStorage.setItem('currentUser', JSON.stringify(action.payload));
        },
        logOut(state, action) {
            state.user = null;
            localStorage.removeItem('currentUser');
        },
        authPersisted(state, action) {
            state.user = action.payload;
        }
    }, 
    extraReducers: builder => {
        builder
        .addCase(signIn.pending, (state, action) => {
            state.status = 'sign in pending';
        })
        .addCase(signIn.fulfilled, (state, action) => {
            state.user = action.payload;
            state.status = 'sign in success';
            localStorage.setItem('currentUser', JSON.stringify(action.payload));
        })
        .addCase(signIn.rejected, (state, action) => {
            state.error = action.payload;
            state.status = 'sign in rejected';
        })
        .addCase(signUp.pending, (state, action) => {
            state.status = 'sign up pending';
        })
        .addCase(signUp.fulfilled, (state, action) => {
            state.user = action.payload;
            state.status = 'sign up success';
            localStorage.setItem('currentUser', JSON.stringify(action.payload));
        })
        .addCase(signUp.rejected, (state, action) => {
            state.error = action.payload;
            state.status = 'sign up rejected';
        })
    }
})

export const signIn = createAsyncThunk('auth/signIn', 
async (user, {rejectWithValue}) => {
    try {
        const { data } = await api.signIn(user)
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const signUp = createAsyncThunk('auth/signUp', 
async (user, {rejectWithValue}) => {
    try {
        const { data } = await api.signUp(user)
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const { googleAuth, logOut, authPersisted } = authSlice.actions;

export default authSlice.reducer