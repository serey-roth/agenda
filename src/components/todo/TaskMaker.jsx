import React, { useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { MdClose } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { format, isBefore, isAfter } from 'date-fns'

import Input from '../styled/Input'
import Select from '../styled/Select'
import Button from '../styled/Button'

import TaskDatePicker from './TaskDatePicker'
import { 
    selectAllProjectNames, 
    setTaskDates 
} from '../../redux/todoSlice/todoSlice'
import { createTask } from '../../redux/todoSlice/tasks'
import { 
    toggleTaskMaker, 
    selectTaskMaker, 
    dateSelectTaskMaker, 
} from '../../redux/uiSlice'

const TaskMaker = ({selectedProject}) => {
    const dispatch = useDispatch();

    const taskmaker = useSelector(selectTaskMaker);

    const projects = useSelector(selectAllProjectNames);

    const [specificEndDate, setSpecificEndDate] = useState(null);

    const handleSpecificEndDate = (date) => {
        setSpecificEndDate(date);
    }

    const initial = {
        title: '',
        description: '',
        priority: 'low',
        project: selectedProject ? selectedProject : 'Inbox',
        start: taskmaker.selectedDate ? 
        taskmaker.selectedDate.start : 
        format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        end: taskmaker.selectedDate ? 
        taskmaker.selectedDate.end : '',
    }

    const projectsOptions = (
        <>
            {projects.map(projectKey => (
                <option key={projectKey}
                value={projectKey}>{projectKey}</option>
            ))}
        </>
    );

    const onFormSubmit = (values) => {
        let newValues = setTaskDates(values, specificEndDate);
        dispatch(createTask(newValues));
        if (taskmaker.selectedDate) {
            dispatch(dateSelectTaskMaker(null));
        }
        setSpecificEndDate(null);
    }

    const onCancel = (resetForm, setTouched, setErrors) => {
        dispatch(toggleTaskMaker(false));
        if (taskmaker.selectedDate) {
            dispatch(dateSelectTaskMaker(null));
        }
        resetForm(initial);
        setTouched({});
        setErrors({});
        setSpecificEndDate(null);
    }

    return (
        <Formik
        enableReinitialize
        initialValues={initial}
        validationSchema={Yup.object({
            title: Yup.string().trim()
            .required('Must enter a title'),
            start: Yup.date()
            .test(
                'isBeforeEnd',
                'Must be before end date',
                (value, context) => {
                    return value === undefined ||
                    context.parent.end === undefined 
                    || isBefore(new Date(value),
                    new Date(context.parent.end));
                }
            )
            .required('Must enter a start date'),
            end: Yup.date()
            .test(
                'isAfterStart',
                'Must be after start date',
                (value, context) => {
                    return context.parent.start === undefined ||
                    value === undefined || 
                    isAfter(new Date(value),
                    new Date(context.parent.start));
                }
            )
        })}
        onSubmit={(values, { resetForm }) => {
            onFormSubmit(values);
            resetForm(initial)
        }}
        >
        {(formik) => (
            <form onSubmit={formik.handleSubmit}
            className={`flex flex-col bg-ivory text-gunmetal
            gap-1 px-4 py-2 text-[0.7em] w-screen sm:w-[300px]
            absolute top-0 bottom-0 right-0 z-10 mix-blend-luminosity 
            backdrop-blur-sm ${taskmaker.visible ? '' : ' hidden'}`}>
                <span className='flex w-full items-center px-1'>
                    <h1 className='text-[1.3em] grow font-semibold'>
                        What's on your mind today?
                    </h1>
                    <Button type='button'
                    onClick={() => onCancel(formik.resetForm, 
                        formik.setTouched,
                        formik.setErrors)}>
                        <MdClose />
                    </Button>
                </span>

                <Input 
                label='Task Title*'
                type='text'
                id='title'
                name='title'
                touched={formik.touched.title}
                error={formik.errors.title}
                placeholder='e.g. Call Amanda'
                {...formik.getFieldProps('title')}/>

                <textarea className={`rounded-lg
                px-3 py-1 h-[50px] resize-none`}
                placeholder="e.g. It's her birthay next week!"
                {...formik.getFieldProps('description')}>
                </textarea>

                <span className='flex gap-1 w-full'>
                    <Select 
                    label='Project'
                    name='project'
                    id='project'
                    {...formik.getFieldProps('project')}>
                        {projectsOptions}
                    </Select>
                    <Select 
                    label='Priority'
                    name='priority'
                    id='priority'
                    {...formik.getFieldProps('priority')}>
                        <option value='low'>Low</option>
                        <option value='med'>Medium</option>
                        <option value='high'>High</option>
                        <option value='urg'>Urgent</option>
                    </Select>
                </span>

                <TaskDatePicker 
                specificEndDate={specificEndDate}
                onSpecificEndDate={handleSpecificEndDate}>
                    <Input 
                    label='Start'
                    type='datetime-local'
                    id='start'
                    name='start'
                    addOnClass={specificEndDate ? 
                        'cursor-not-allowed contrast-50' : ''}
                    touched={formik.touched.start}
                    error={formik.errors.start}
                    {...formik.getFieldProps('start')}/>

                    <Input 
                    label='End (empty = due in 1 hr)'
                    type='datetime-local'
                    id='end'
                    name='end'
                    addOnClass={specificEndDate ? 
                        'cursor-not-allowed contrast-50' : ''}
                    touched={formik.touched.end}
                    error={formik.errors.end}
                    {...formik.getFieldProps('end')}/>
                </TaskDatePicker>

                <span className='flex w-full mt-1 gap-1'>
                    <Button addOnClass='grow' type='button'
                    onClick={() => onCancel(formik.resetForm, 
                        formik.setTouched,
                        formik.setErrors)}>
                        Cancel
                    </Button>
                    <Button addOnClass='grow' type='submit'>
                        Add
                    </Button>
                </span>
            </form>
        )}
        </Formik>
    )
}

export default TaskMaker