import {configureStore} from '@reduxjs/toolkit'

import authReducer from './authSlice'
import todoReducer from './todoSlice/todoSlice'
import uiReducer from './uiSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        todo: todoReducer,
        ui: uiReducer,
    }
})

export default store;