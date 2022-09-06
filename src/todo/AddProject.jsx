import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'

import Input from '../components/styled/Input'
import Button from '../components/styled/Button'

import { projectAdded, selectAllProjectKeys } from './todoSlice'

const AddProject = ({ visible, onToggle }) => {
    const projects = useSelector(selectAllProjectKeys);

    const dispatch = useDispatch();

    return (
        <>
            <Formik
            initialValues={{
                title: '',
            }}
            validationSchema={Yup.object({
                title: Yup.string().trim()
                .required('Must enter a title name')
                .test({
                    name: 'hasAlreadyExisted',
                    message: 'Only new projects please!',
                    params: { projects },
                    test: (value) => 
                        projects.findIndex(project => 
                            project.title === value) === -1
                })
            })}
            onSubmit={(values, { resetForm }) => {
                dispatch(projectAdded(values.title));    
                resetForm({title: ''});          
            }}>
            {(formik) => (
                <form onSubmit={formik.handleSubmit}
                className={'w-full flex flex-col gap-1' +
                (visible ? '' : ' hidden')}>
                    <Input
                    label='Project Name'
                    type='text'
                    id='title'
                    name='title'
                    touched={formik.touched.title}
                    error={formik.errors.title} 
                    placeholder='e.g. Back Garden'
                    {...formik.getFieldProps('title')}/>
                    <span className='flex gap-1 w-full justify-around'>
                        <Button addOnClass='grow' type='button' 
                        onClick={onToggle}>
                            Cancel
                        </Button>
                        <Button addOnClass='grow' type='submit'>
                            Add
                        </Button>
                    </span>
                </form>
            )}
            </Formik>
        </>
    )
}

export default AddProject