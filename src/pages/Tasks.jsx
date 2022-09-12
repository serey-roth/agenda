import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

import Loading from '../components/styled/Loading'
import CalendarView from '../components/todo/CalendarView';
import TaskMaker from '../components/todo/TaskMaker';
import AddTaskButton from '../components/todo/AddTaskButton';

const Tasks = () => {	
	const status = useSelector(state => state.todo.status);

	return (
		<div className='flex flex-1 flex-col bg-ivory 
        dark:bg-gray-400 relative'>
			{status === 'pending' && 
            (<Loading color={'text-gunmetal'}/>)}

			<CalendarView />

			<AddTaskButton />
			
			<TaskMaker />
 
			<Outlet />
		</div>
	)
}

export default Tasks