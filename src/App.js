import React from 'react'
import {
	Routes,
	Route, 
	Outlet,  
	Navigate, 
	useParams,
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaBars, FaUserCircle } from 'react-icons/fa'
import { toggleSidebar, selectSidebar } from './redux/uiSlice'

import './fullcalendar-vars.css'

import Header from './components/styled/Header'
import Sidebar from './components/sidebar/Sidebar'

import LogIn from './auth/LogIn'
import Register from './auth/Register'

import CalendarView from './todo/CalendarView';
import KanbanView from './todo/KanbanView';
import TaskMaker from './todo/TaskMaker';
import AddTaskButton from './todo/AddTaskButton';
import TaskEditor from './todo/TaskEditor';

const Home = () => {
	const sidebar = useSelector(selectSidebar);
	const dispatch = useDispatch();
    return (
        <div className='w-full flex flex-col h-screen'>
            <Header>
				<span className='w-full grid grid-cols-2'>
					<span className='flex gap-1 items-center'>
						<button onClick={() => 
							dispatch(toggleSidebar(!sidebar))}>
						<FaBars /></button>
						<h1>to do list</h1>
					</span>
					<span className='flex gap-1 justify-self-end items-center'>
						<p>Hello, user!</p>
						<button>
							<FaUserCircle />
						</button>
					</span>
				</span>
			</Header>
			<div className='relative flex flex-1'>
				<Sidebar />
				
				<Outlet />
			</div>
        </div>
    )
}

const ProtectedRoute = ({user, redirectPath, children}) => {
	if (user) {
		return <>{children}</>;
	} else {
		return <Navigate to={redirectPath} replace />
	}
}

const AuthLayOut = () => {
	return (
		<div className='w-screen h-screen sm:w-[500px]
		sm:h-[500px] bg-ivory text-gunmetal
		flex justify-center items-center 
		drop-shadow-md shadow-slate-200'>
			<Outlet />
		</div>
	)
}

const Tasks = () => {	
	return (
		<div className='flex flex-1 flex-col bg-ivory relative'>

			<CalendarView />

			<AddTaskButton />
			
			<TaskMaker />
 
			<Outlet />
		</div>
	)
}

const Projects = () => {
	const {title} = useParams();
	
	return (
		<div className='flex flex-1 flex-col bg-ivory relative'>

			<KanbanView title={title}/>

			<AddTaskButton />
			
			<TaskMaker selectedProject={title}/>

			<Outlet />
			
		</div>
	)
}

function App() {
	const user = useSelector(state => state.auth.user);

    return (
		<div className='flex flex-col items-center justify-center
		w-screen min-h-screen bg-gunmetal box-border'>
			<Routes>
				<Route exact path='/' element={
					<ProtectedRoute
					user={user}
					redirectPath={'/auth'}>
						<Home />
					</ProtectedRoute>
				}>
					<Route index element={<Tasks />} />
					<Route path='tasks' element={<Tasks />}>
						<Route path=':taskId' 
						element={<TaskEditor />} />
					</Route>
					<Route path='projects' element={<Outlet />}>
						<Route path=':title' element={<Projects />}>
							<Route path='task' element={<Outlet />}>
								<Route path=':taskId' 
								element={<TaskEditor />} />
							</Route>
						</Route>
					</Route>
				</Route>
				<Route path='/auth' element={<AuthLayOut />}>
					<Route index element={<LogIn />} />
					<Route path='signup' element={<Register />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App;
