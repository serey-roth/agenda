import { createSlice, nanoid } from '@reduxjs/toolkit'
import { format, addDays, addHours } from 'date-fns'

const initialState = {
    tasks: [],
    projects: {
        'Inbox': {
            [nanoid()] : {
                title: 'To Do',
                items: [],
            },
            [nanoid()] : {
                title: 'In Progress',
                items: [],
            },
            [nanoid()] : {
                title: 'Completed',
                items: [],
            },
        },
    },
    status: 'idle',
    error: '',
}

const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        taskAdded: {
            reducer: (state, action) => {
                //add to tasks
                state.tasks.push(action.payload);
                //add to projects
                const collections = state.projects[action.payload.project];
                const keys = Object.keys(collections);
                collections[keys[0]].items.push(action.payload);
            },
            prepare(values) {
                return {
                    payload: {
                        id: nanoid(),
                        isCompleted: false,
                        completeStatus: 'to do',
                        ...values
                    }
                }
            }
        },
        taskRemoved(state, action) {
            //remove from tasks
            const { id, project } = action.payload;
            state.tasks = state.tasks.filter(item => item.id !== id)
            //remove from projects
            const collections = state.projects[project];
            for (const value of Object.values(collections)) {
                let index = value.items.findIndex(item => 
                    item.id === id);
                if (index !== -1) {
                    value.items.splice(index, 1);
                }
            }
        },
        taskUpdated(state, action) {
            const { id, project, ...rest } = action.payload;
            //update in tasks
            let existingTaskId = state.tasks.findIndex(item => 
                item.id === id);
            if (existingTaskId !== -1) {
                let task = state.tasks[existingTaskId];
                state.tasks[existingTaskId] = {...task, project, ...rest};
            }
            //update in projects
            const collections = state.projects[project];
            for (const value of Object.values(collections)) {
                let index = value.items.findIndex(item => 
                    item.id === id);
                if (index !== -1) {
                    let item = value.items[index];
                    value.items[index] = {...item, project, ...rest};
                }
            }
        },
        taskCompleteStatusChanged(state, action) {
            const { id, project, ...rest } = action.payload;
            //update in tasks
            let existingTaskId = state.tasks.findIndex(item => 
                item.id === id);
            let task = state.tasks[existingTaskId];
            if (existingTaskId !== -1) {
                state.tasks[existingTaskId] = {...task, project, ...rest};
            }
            //update in projects
            let oldStatus = task.completeStatus;
            const collections = state.projects[project];
            for (const value of Object.values(collections)) {
                if (value.title.toLowerCase() === oldStatus) {
                    let index = value.items.findIndex(item => 
                        item.id === id);
                    if (index !== -1) {
                        value.items.splice(index, 1);
                    }
                } else if (value.title.toLowerCase()  === 
                    action.payload.completeStatus) {
                    value.items.push({...task, project, ...rest});
                }
            }
        },
        taskProjectChanged(state, action) {
            const {id, project, newProject, ...rest} = action.payload;
            //update in tasks
            const existingTaskId = state.tasks.findIndex(item => 
                item.id === id);
            const task = state.tasks[existingTaskId];
            if (existingTaskId !== -1) {
                state.tasks[existingTaskId] = {...task, project: newProject, ...rest};
            }
            //update in projects
            let collections = state.projects[project];
            for (const value of Object.values(collections)) {
                let index = value.items.findIndex(item => 
                    item.id === id);
                if (index !== -1) {
                    value.items.splice(index, 1);
                }
            }
            collections = state.projects[newProject];
            const keys = Object.keys(collections);
            collections[keys[0]].items.push({...task, project: newProject, ...rest});
        },
        projectAdded: {
            reducer: (state, action) => {
                const result = Object.entries(action.payload);
                state.projects[result[0][0]] = result[0][1];
            },
            prepare(title) {
                return {
                    payload: {
                        [title]: {
                            [nanoid()] : {
                                title: 'To Do',
                                items: [],
                            },
                            [nanoid()] : {
                                title: 'In Progress',
                                items: [],
                            },
                            [nanoid()] : {
                                title: 'Completed',
                                items: [],
                            },
                        }                  
                    }
                }
            }
        },
        projectRemoved(state, action) {
            const { title } = action.payload;
            delete state.projects[title];
        },
        projectUpdated(state, action) {
            const {title, items} = action.payload;
            state.projects[title] = {
                ...state.projects[title],
                ...items
            };
        }
    }
})

export const selectAllProjectKeys = state => {
    return Object.keys(state.todo.projects);
}

export const selectProjectByKey = (key) => state => state.todo.projects[key];

export const selectAllTasks = state => state.todo.tasks;

export const selectTasksByProject = (project) => (state) => 
    state.todo.tasks.filter(task => task.project === project);

export const selectTaskById = (id) => (state) => 
    state.todo.tasks.find(task => task.id === id);

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

export const { 
    taskAdded, 
    taskRemoved,
    taskUpdated, 
    taskProjectChanged,
    taskCompleteStatusChanged,
    projectAdded, 
    projectRemoved, 
    projectUpdated
} = todoSlice.actions;

export default todoSlice.reducer;