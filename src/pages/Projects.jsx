import React, { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { getCurrentProject } from '../redux/todoSlice/projects'

import KanbanView from '../components/todo/KanbanView';
import TaskMaker from '../components/todo/TaskMaker';
import AddTaskButton from '../components/todo/AddTaskButton';
import Loading from '../components/styled/Loading'
import Select from '../components/styled/Select'
import { setProjectSortSelection } from '../redux/uiSlice';

const Projects = () => {
	const {title} = useParams();
	const dispatch = useDispatch();
	const user = useSelector(state => state.auth.user);
	const ui = useSelector(state => state.ui);
	const status = useSelector(state => state.todo.status);

	useEffect(() => {
		if (user && !(ui.taskeditor || ui.taskmaker.visible)) {
			dispatch(getCurrentProject({
                title, 
                sortBy: ui.projectSort
            }));
		}
	}, [dispatch, title, user, ui]);
	
	return (
		<div className='flex flex-1 flex-col bg-ivory 
        dark:bg-timberwolf relative'>
			{status === 'pending' && (<Loading color={'text-ivory'}/>)}
            <span className='flex px-3 py-1 items-center gap-1 w-full'>
				<h1 className='flex-1 text-xl font-bold italic 
				uppercase'>{title}</h1>
				<span className='flex items-center gap-1'>
					<p className='relative top-0.5'>Sort:</p>
					<Select
					name='sort'
					id='sort'
					value={ui.projectSort}
					onChange={(e) => {
						dispatch(setProjectSortSelection(e.target.value));
						dispatch(getCurrentProject({
						title,
						sortBy: e.target.value,
					}))}}>
					<option value='none'>None</option>
					<option value='priority'>Priority</option>
					<option value='end'>Due Date</option>
					</Select>
				</span>
			</span>

			<KanbanView />

			<AddTaskButton />
			
			<TaskMaker selectedProject={title}/>

			<Outlet />
			
		</div>
	)
}

export default Projects