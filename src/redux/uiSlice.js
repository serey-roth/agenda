import { createSlice } from '@reduxjs/toolkit'

const initial = {
    sidebar: true, 
    taskeditor: false, 
    taskmaker: {
        visible: false, 
        selectedDate: null,
    }
}

const uiSlice = createSlice({
    name: 'ui',
    initialState: initial,
    reducers: {
        toggleSidebar(state, action) {
            state.sidebar = action.payload;
        },
        toggleTaskEditor(state, action) {
            state.taskeditor = action.payload;
        },
        toggleTaskMaker(state, action) {
            state.taskmaker.visible = action.payload;
        },
        dateSelectTaskMaker(state, action) {
            state.taskmaker.selectedDate = action.payload;
        },
    }
})

export const {
    toggleSidebar,
    toggleTaskEditor,
    toggleTaskMaker,
    dateSelectTaskMaker,
} = uiSlice.actions;

export const selectTaskMaker = state => state.ui.taskmaker;

export const selectTaskEditor = state => state.ui.taskeditor;

export const selectSidebar = state => state.ui.sidebar;

export default uiSlice.reducer