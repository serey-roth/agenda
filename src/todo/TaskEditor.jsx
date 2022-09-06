import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams} from 'react-router-dom'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { MdClose, MdDelete, MdError } from 'react-icons/md'
import { HiDuplicate } from 'react-icons/hi'
import { isBefore, isAfter } from 'date-fns'

import Input from '../components/styled/Input'
import Button from '../components/styled/Button'
import Select from '../components/styled/Select'
import CheckBox from '../components/styled/CheckBox'
import Header from '../components/styled/Header'

import TaskDatePicker from './TaskDatePicker'

import { 
    setTaskDates,
    taskUpdated, 
    taskRemoved,
    taskAdded,
    taskProjectChanged,
    taskCompleteStatusChanged,
    selectAllProjectKeys,
    selectTaskById,    
} from './todoSlice'
import { toggleTaskEditor } from '../redux/uiSlice'

const TaskEditor = () => {
    const { taskId } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const projects = useSelector(selectAllProjectKeys);
    const task = useSelector(selectTaskById(taskId));

    const [editorMode, setEditorMode] = useState(false);
    const [project, setProject] = useState(task ? task.project : '');
    const [priority, setPriority] = useState(task ? task.priority: '');
    const [start, setStart] = useState(task ? task.start : '');
    const [end, setEnd] = useState(task ? (task.specificEndDate ? '' :
        task.end) : '');
    const [specificEndDate, setSpecificEndDate] = useState(task ?
        task.specificEndDate : '');

    const handleToggleEditorMode = () => {
        setEditorMode(prevState => !prevState)
    }

    const handleSpecificEndDateChange = (date) => {
        if (date) {
            let newTask = setTaskDates(task, date);
            dispatch(taskUpdated(newTask));
        } else {
            dispatch(taskUpdated({...task, end: null,
                specificEndDate: null}));
            setEnd('');
        }
        setSpecificEndDate(date);
    }

    const handleProjectChange = (e) => {
        setProject(e.target.value);
        dispatch(taskProjectChanged({...task, 
            newProject: e.target.value}));
    }

    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
        dispatch(taskUpdated({...task, 
            priority: e.target.value}));
    }

    const handleStartDateChange = (e) => {
        if (end === '' || 
        isBefore(new Date(e.target.value), new Date(end))) {
            dispatch(taskUpdated({...task, 
                start: e.target.value}));
        }
        setStart(e.target.value);
    }

    const handleEndDateChange = (e) => {
        if (isAfter(new Date(e.target.value), new Date(start))) {
            dispatch(taskUpdated({...task, 
                end: e.target.value, 
                allDay: false}));
        }
        setEnd(e.target.value);
    }

    const handleCompleteStatusChange = (e, isCompleted, formikHandler) => {
        formikHandler(e);
        let oldIsCompleted = isCompleted;
        dispatch(taskCompleteStatusChanged({
            ...task, 
            isCompleted: !oldIsCompleted,
            completeStatus: (oldIsCompleted ? 'to do' : 'completed'),
        }))
    }

    const handleDelete = () => {
        dispatch(taskRemoved(task));
        dispatch(toggleTaskEditor(false));
        navigate(-1, {replace: true});
    }

    const handleDuplicate = () => {
        const {id, ...rest} = task;
        dispatch(taskAdded({...rest}));
    }

    const handleClose = () => {
        dispatch(toggleTaskEditor(false));
        navigate(-1, {replace: true});
    }

    const projectsOptions = (
        <>
            {projects.map(projectKey => (
                <option key={project}
                value={project}>{project}</option>
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
                text-lg'>{project}</h3>
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
                    dispatch(taskUpdated({...task, ...values}));
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
                            'cursor-not-allowed' : ''}`}
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
                    value={project}
                    onChange={handleProjectChange}>
                        {projectsOptions}
                    </Select>

                    <Select 
                    label='Priority'
                    name='priority'
                    id='priority'
                    value={priority}
                    onChange={handlePriorityChange}>
                        <option value='low'>Low</option>
                        <option value='med'>Medium</option>
                        <option value='high'>High</option>
                        <option value='urg'>Urgent</option>
                    </Select>

                    <TaskDatePicker 
                    specificEndDate={specificEndDate}
                    onSpecificEndDate={handleSpecificEndDateChange}>
                        <Input 
                        label='Start'
                        type='datetime-local'
                        id='start'
                        name='start'
                        value={start}
                        onChange={handleStartDateChange}>
                        {end === '' || start === ''
                        || isBefore(new Date(start), new Date(end)) ?
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
                        value={specificEndDate ? '' : end}
                        addOnClass={specificEndDate ? 
                            'cursor-not-allowed contrast-50' : ''}
                        onChange={handleEndDateChange}>
                        {end === '' || start === '' ||
                        isAfter(new Date(end), new Date(start)) ?
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