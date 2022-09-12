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
        logOut(state, action) {
            localStorage.removeItem('currentUser');
        },
        authPersisted(state, action) {
            state.user = action.payload;
        }
    }, 
    extraReducers: builder => {
        builder
        .addCase(signIn.pending, (state, action) => {
            state.status = 'pending';
        })
        .addCase(signIn.fulfilled, (state, action) => {
            state.user = action.payload;
            state.status = 'idle';
            localStorage.setItem('currentUser', JSON.stringify(action.payload));
        })
        .addCase(signIn.rejected, (state, action) => {
            state.error = action.payload;
            state.status = 'rejected';
        })
        .addCase(signUp.pending, (state, action) => {
            state.status = 'pending';
        })
        .addCase(signUp.fulfilled, (state, action) => {
            state.user = action.payload;
            state.status = 'idle';
            localStorage.setItem('currentUser', JSON.stringify(action.payload));
        })
        .addCase(signUp.rejected, (state, action) => {
            state.error = action.payload;
            state.status = 'rejected';
        })
        .addCase(googleSignIn.fulfilled, (state, action) => {
            state.user = action.payload;
            state.status = 'idle';
            localStorage.setItem('currentUser', JSON.stringify(action.payload));
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

export const googleSignIn = createAsyncThunk('auth/googleSignIn', 
async (data) => {
    const { email, name } = data.result;
    const { userId } = data;
    const { result, token } = data;
    try {
        await api.googleSignIn({email, name, userId});
        return {result, token};
    } catch(error) {
        console.log(error.message);
    }
});

export const { logOut, authPersisted } = authSlice.actions;

export default authSlice.reducer