import {configureStore} from '@reduxjs/toolkit'

import authReducer from '../auth/authSlice'
import todoReducer from '../todo/todoSlice'
import uiReducer from './uiSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        todo: todoReducer,
        ui: uiReducer,
    }
})

export default store;