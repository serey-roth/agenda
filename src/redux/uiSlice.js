import { createSlice } from '@reduxjs/toolkit'

const initial = {
    sidebar: true, 
    taskeditor: false, 
    taskmaker: {
        visible: false, 
        selectedDate: null,
    },
    darkMode: false,
    projectSort: 'none'
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
        toggleDarkMode(state, action) {
            state.darkMode = !state.darkMode;
            if (state.darkMode) {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        },
        setProjectSortSelection(state, action) {
            state.projectSort = action.payload;
        }
    }
})

export const {
    toggleSidebar,
    toggleTaskEditor,
    toggleTaskMaker,
    dateSelectTaskMaker,
    toggleDarkMode,
    setProjectSortSelection
} = uiSlice.actions;

export const selectTaskMaker = state => state.ui.taskmaker;

export const selectTaskEditor = state => state.ui.taskeditor;

export const selectSidebar = state => state.ui.sidebar;

export const getPriorityColor = (priority) => {
    switch(priority) {
        case '2': return 'bg-yellow-300';
        case '3': return 'bg-pink-400';
        case '4': return 'bg-red-500';
        default: return 'bg-green-300';
    }
}

export default uiSlice.reducer