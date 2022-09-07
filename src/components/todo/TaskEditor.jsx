import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams} from 'react-router-dom'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { MdClose, MdDelete, MdError } from 'react-icons/md'
import { HiDuplicate } from 'react-icons/hi'
import { isBefore, isAfter } from 'date-fns'

import Input from '../styled/Input'
import Button from '../styled/Button'
import Select from '../styled/Select'
import CheckBox from '../styled/CheckBox'
import Header from '../styled/Header'

import TaskDatePicker from './TaskDatePicker'

import { 
    setTaskDates,
    selectAllProjectNames,
    selectTaskById,
} from '../../redux/todoSlice/todoSlice'
import { toggleTaskEditor } from '../../redux/uiSlice'
import {
    deleteTask,
    duplicateTask,
    updateTask, 
} from '../../redux/todoSlice/tasks'

const TaskEditor = () => {
    const { taskId } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const projects = useSelector(selectAllProjectNames);
    const task = useSelector(selectTaskById(taskId));

    const [editorMode, setEditorMode] = useState(false);
    const [values, setValues] = useState({
        project: task ? task.project : '',
        priority: task ? task.priority : '',
        start: task ? task.start : '',
        end: task ? (task.specificEndDate ? '' :
        task.end) : '',
        specificEndDate: task ?
        task.specificEndDate : ''
    });

    const handleToggleEditorMode = () => {
        setEditorMode(prevState => !prevState)
    }

    const handleSpecificEndDateChange = (date) => {
        if (date) {
            let updatedTask = setTaskDates(task, date);
            dispatch(updateTask({
                id: task._id, 
                updatedTask
            }));
        } else {
            dispatch(updateTask({
                id: task._id,
                updatedTask: {
                    ...task, 
                    end: null,
                    specificEndDate: null,
                }
            }));
            setValues(prevState => ({...prevState, end: ''}));
        }
        setValues(prevState => ({...prevState, specificEndDate: date}));
    }

    const handleProjectChange = (e) => {
        dispatch(updateTask({
            id: task._id,
            updatedTask: {
                ...task, 
                project: e.target.value
            }
        }));
        setValues(prevState => ({...prevState, project: e.target.value}));
    }

    const handlePriorityChange = (e) => {
        dispatch(updateTask({
            id: task._id,
            updatedTask: {
                ...task, 
                priority: e.target.value
            }
        }));
        setValues(prevState => ({...prevState, priority: e.target.value}));
    }

    const handleStartDateChange = (e) => {
        if (values.end === '' || 
        isBefore(new Date(e.target.value), new Date(values.end))) {
            dispatch(updateTask({
                id: task._id,
                updatedTask: {
                    ...task, 
                    start: e.target.value
                }
            }));
        }
        setValues(prevState => ({...prevState, start: e.target.value}));
    }

    const handleEndDateChange = (e) => {
        if (isAfter(new Date(e.target.value), new Date(values.start))) {
            dispatch(updateTask({
                id: task._id,
                updatedTask: {
                    ...task, 
                    end: e.target.value, 
                    allDay: false
                }
            }));
        }
        setValues(prevState => ({...prevState, end: e.target.value}));
    }

    const handleCompleteStatusChange = (e, isCompleted, formikHandler) => {
        formikHandler(e);
        let oldIsCompleted = isCompleted;
        dispatch(updateTask({
            id: task._id,
            updatedTask: {
                ...task, 
                isCompleted: !oldIsCompleted,
                completeStatus: (oldIsCompleted ? 'to do' : 'completed'),
            }
        }))
    }

    const handleDelete = () => {
        dispatch(deleteTask(task._id));
        dispatch(toggleTaskEditor(false));
        navigate(-1, {replace: true});
    }

    const handleDuplicate = () => {
        dispatch(duplicateTask(task._id));
    }

    const handleClose = () => {
        dispatch(toggleTaskEditor(false));
        navigate(-1, {replace: true});
    }

    const projectsOptions = (
        <>
            {projects.map(projectKey => (
                <option key={projectKey}
                value={projectKey}>{projectKey}</option>
            ))}
        </>
    );

    return (
        <div className='w-screen sm:w-[80%] h-full
        md:h-[500px] absolute z-20 sm:top-1/2 sm:left-1/2 
        sm:-translate-x-1/2 sm:-translate-y-1/2
        flex flex-col items-stretch border-2 
        border-slate-300 drop-shadow-xl
        bg-ivory text-gunmetal text-[12px]'>
            <Header>
                <h3 className='grow-[2] w-full text-md font-semibold
                text-lg'>{values.project}</h3>
                <span className='flex gap-1'>
                    <Button 
                    addOnClass='bg-blush text-[16px] border-0'
                    onClick={handleDuplicate}>
                        <HiDuplicate />
                    </Button>

                    <Button 
                    addOnClass='bg-blush text-[14px] border-0'
                    onClick={handleDelete}>
                        <MdDelete />
                    </Button>

                    <Button 
                    addOnClass='bg-blush text-[14px] border-0'
                    onClick={handleClose}>
                        <MdClose />
                    </Button>
                </span>
            </Header>
            <div className='flex md:flex-row
            flex-col p-3 gap-4'> 
                <Formik
                initialValues={{
                    title: task ? task.title : '',
                    description: task ? task.description : '',
                    isCompleted: task ? task.isCompleted : false,
                }}
                validationSchema={Yup.object({
                    title: Yup.string()
                    .trim()
                    .required('Must enter a title'),
                })}
                onSubmit={(values) => {
                    setEditorMode(false);
                    dispatch(updateTask({
                        id: task._id,
                        updatedTask: {...task, ...values}
                    }));
                }}>
                {(formik) => (
                    <form onSubmit={formik.handleSubmit}
                    className='flex grow gap-1 md:w-[80%] w-[96%]
                    items-start'>
                        <CheckBox 
                        id='isCompleted'
                        name='isCompleted' 
                        checked={formik.values.isCompleted}
                        className={`mt-1 ${editorMode ? 
                            'cursor-not-allowed pointer-events-none' : ''}`}
                        value={formik.values.isCompleted}
                        onChange={(e) => handleCompleteStatusChange(e, 
                            formik.values.isCompleted, formik.handleChange)} />

                        <span className='flex flex-col gap-2 w-full'>
                            <Input 
                            label='Task Title*'
                            type='text'
                            id='title'
                            name='title'
                            touched={formik.touched.title}
                            error={formik.errors.title}
                            placeholder='e.g. Call Amanda'
                            addOnClass={formik.values.isCompleted ? 
                            'line-through': ''}
                            onClick={() => {
                                if (!editorMode) {
                                    handleToggleEditorMode();
                                }
                            }}
                            {...formik.getFieldProps('title')}/>

                            <textarea className='rounded-lg
                            px-3 py-2 h-[100px] resize-none'
                            placeholder="e.g. It's her birthay next week!"
                            onClick={() => {
                                if (!editorMode) {
                                    handleToggleEditorMode();
                                }
                            }}
                            {...formik.getFieldProps('description')}>
                            </textarea>

                            <span className={`grid grid-cols-2 mt-2 
                             ${editorMode ? '' : ' hidden'}`}
                            >
                                <Button type='button'
                                onClick={handleToggleEditorMode}>
                                    Cancel
                                </Button>
                                <Button type='submit'>
                                    Done
                                </Button>
                            </span>
                        </span>
                    </form>
                )}
                </Formik>
                <div className={`flex flex-col px-2 gap-1
                ${editorMode ? `cursor-not-allowed 
                pointer-events-none brightness-50` 
                : ''}`}>
                    <Select 
                    label='Project'
                    name='project'
                    id='project'
                    value={values.project}
                    onChange={handleProjectChange}>
                        {projectsOptions}
                    </Select>

                    <Select 
                    label='Priority'
                    name='priority'
                    id='priority'
                    value={values.priority}
                    onChange={handlePriorityChange}>
                        <option value='low'>Low</option>
                        <option value='med'>Medium</option>
                        <option value='high'>High</option>
                        <option value='urg'>Urgent</option>
                    </Select>

                    <TaskDatePicker 
                    specificEndDate={values.specificEndDate}
                    onSpecificEndDate={handleSpecificEndDateChange}>
                        <Input 
                        label='Start'
                        type='datetime-local'
                        id='start'
                        name='start'
                        value={values.start}
                        onChange={handleStartDateChange}>
                        {values.end === '' || values.start === ''
                        || isBefore(new Date(values.start), new Date(values.end)) ?
                        null : 
                        <span className='w-full gap-1 flex items-center'>
                            <MdError />
                            <p className='text-blush grow font-semibold italic'>
                                Must be before end date
                            </p>
                        </span>
                        }
                        </Input>

                        <Input 
                        label='End'
                        type='datetime-local'
                        id='end'
                        name='end'
                        value={values.specificEndDate ? '' : values.end}
                        addOnClass={values.specificEndDate ? 
                            'cursor-not-allowed contrast-50 pointer-events-none' : ''}
                        onChange={handleEndDateChange}>
                        {values.end === '' || values.start === '' ||
                        isAfter(new Date(values.end), new Date(values.start)) ?
                        null :  
                        <span className='w-full gap-1 flex items-center'>
                            <MdError />
                            <p className='text-blush grow font-semibold italic'>
                                Must be after start date
                            </p>
                        </span>
                        }
                        </Input>
                    </TaskDatePicker>
                </div>
            </div>
        </div>
    )
}

export default TaskEditor