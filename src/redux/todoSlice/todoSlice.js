import { 
    createSlice, 
    nanoid, 
} from '@reduxjs/toolkit'
import { format, addDays, addHours } from 'date-fns'

import {
    getTasks,
    createTask,
    deleteTask,
    updateTask,
    duplicateTask,
} from './tasks'
import {
    getCurrentProject,
    getProjectNames,
    addProject
} from './projects'

const initialState = {
    tasks: [],
    projectNames: ['Inbox'],
    currentProject: {
        name: '',
        [nanoid()] : {
            title: 'to do',
            items: [],
        },
        [nanoid()] : {
            title: 'in progress',
            items: [],
        },
        [nanoid()] : {
            title: 'completed',
            items: [],
        },
    },
    status: 'idle',
    error: '',
}

const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        updateCurrentProject(state, action) {
            state.currentProject = {
                ...state.currentProject,
                ...action.payload,
            };
        },
        reset(state, action) {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getTasks.pending, (state, action) => {
            state.status = 'pending';
        })
        .addCase(getTasks.fulfilled, (state, action) => {
            state.status = 'idle';
            state.tasks = action.payload;
        })
        .addCase(createTask.pending, (state, action) => {
            state.status = 'pending';
        })
        .addCase(createTask.fulfilled, (state, action) => {
            state.status = 'success';
            state.tasks.push(action.payload);
            if (!state.projectNames.includes(action.payload.project)) {
                state.projectNames.push(action.payload.project)
            }
        })
        .addCase(deleteTask.pending, (state, action) => {
            state.status = 'pending';
        })
        .addCase(deleteTask.fulfilled, (state, action) => {
            state.status = 'success';
            state.tasks = state.tasks.filter(task => 
                task._id !== action.payload);
        })
        .addCase(updateTask.pending, (state, action) => {
            state.status = 'pending';
        })
        .addCase(updateTask.fulfilled, (state, action) => {
            state.status = 'success';
            state.tasks = state.tasks.map(task => 
            task._id === action.payload._id ? 
            action.payload : task);
        })
        .addCase(duplicateTask.pending, (state, action) => {
            state.status = 'pending';
        })
        .addCase(duplicateTask.fulfilled, (state, action) => {
            state.status = 'success';
            state.tasks.push(action.payload);
        })
        .addCase(getCurrentProject.pending, (state, action) => {
            state.status = 'pending';
        })
        .addCase(getCurrentProject.fulfilled, (state, action) => {
            state.status = 'idle';
            const project = action.payload;
            for (const key of Object.keys(state.currentProject)) {
                if (key !== 'name') {
                    const category = state.currentProject[key].title;
                    state.currentProject[key].items = project[category];
                } else {
                    state.currentProject.name = project.name;
                }
            }
        })
        .addCase(getProjectNames.pending, (state, action) => {
            state.status = 'pending';
        })
        .addCase(getProjectNames.fulfilled, (state, action) => {
            state.status = 'idle';
            state.projectNames = action.payload;
        })
        .addCase(addProject.pending, (state, action) => {
            state.status = 'pending';
        })
        .addCase(addProject.fulfilled, (state, action) => {
            state.status = 'idle';
            state.projectNames.push(action.payload);
        })
    }
})

export const selectAllProjectNames = state => state.todo.projectNames;

export const selectAllTasks = state => state.todo.tasks;

export const selectCurrentProject = state => state.todo.currentProject;

export const selectTaskById = (id) => (state) => 
    state.todo.tasks.find(task => task._id === id);

export const setTaskDates = (values, specificEndDate) => {
    let allDay = false;
    let end;
    if (!specificEndDate) {
        if (values.end === '') {
            end = addHours(new Date(values.start), 1);
            end = format(end, "yyyy-MM-dd'T'HH:mm");
        } else {
            end = values.end;
        }
        allDay = false;
    } else {
        let endDate = new Date(values.start);
        switch (specificEndDate) {
            case 'Tomorrow': {
                endDate = addDays(endDate, 2);
                break;
            }
            case 'This Weekend': {
                endDate = addDays(endDate,
                    7 - endDate.getDay());
                break;
            }
            case 'Next Week': {
                endDate = addDays(endDate, 8);
                break;
            }
            default: {
                endDate = addDays(endDate, 1);
                break;
            }
        }
        end = format(endDate, "yyyy-MM-dd'T'HH:mm");
        allDay = true;
    }
    return {
        ...values,
        end,
        allDay,
        specificEndDate,
    };
}

export const { updateCurrentProject, reset } = todoSlice.actions;

export default todoSlice.reducer;