import React, { useEffect } from 'react'
import {
	Routes,
	Route, 
	Outlet,  
	Navigate, 
	useParams,
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaBars } from 'react-icons/fa'
import decode from 'jwt-decode'
import './fullcalendar-vars.css'

import { toggleSidebar, selectSidebar } from './redux/uiSlice'
import { getTasks } from './redux/todoSlice/tasks'
import { getCurrentProject, getProjectNames } from './redux/todoSlice/projects'
import { authPersisted, logOut } from './redux/authSlice'

import Header from './components/styled/Header'
import Sidebar from './components/sidebar/Sidebar'
import Auth from './components/auth/Auth'
import CalendarView from './components/todo/CalendarView';
import KanbanView from './components/todo/KanbanView';
import TaskMaker from './components/todo/TaskMaker';
import AddTaskButton from './components/todo/AddTaskButton';
import TaskEditor from './components/todo/TaskEditor';

const Home = () => {
	const user = useSelector(state => state.auth.user);
	const sidebar = useSelector(selectSidebar);
	const dispatch = useDispatch();	

	useEffect(() => {
        const token = user?.token;
        if (token) {
            const decodedToken = decode(token);
            if (decodedToken.exp * 1000 < new Date().getTime) {
                dispatch(logOut());
            }
        }
    })

    return (
        <div className='w-full flex flex-col h-screen'>
            <Header>
				<span className='w-full grid grid-cols-2'>
					<span className='flex gap-1 items-center'>
						<button onClick={() => 
							dispatch(toggleSidebar(!sidebar))}>
						<FaBars /></button>
						<h1>agenda</h1>
					</span>
					<span className='flex gap-1 
					justify-self-end items-center capitalize'>
						<p>Hello, {user ? user.result?.name : 'user'}!</p>
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

const ProtectedRoute = ({redirectPath, children}) => {
	const user = useSelector(state => state.auth.user);
	if (user) {
		return <>{children}</>;
	} else {
		return <Navigate to={redirectPath} replace />
	}
}

const AuthLayOut = () => {
	return (
		<div className='w-screen h-screen 
		sm:w-[500px] flex flex-col
		sm:h-[550px] bg-ivory text-gunmetal
		justify-center items-center sm:rounded-md
		drop-shadow-md shadow-slate-200'>
			<Outlet />
		</div>
	)
}

const Tasks = () => {	
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getTasks());
	})

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

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getCurrentProject(title));
	});

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
	const dispatch = useDispatch();

	useEffect(() => {
		const user = localStorage.getItem('currentUser');
		dispatch(authPersisted(user ? JSON.parse(user) : null));
	}, [dispatch])

	useEffect(() => {
		dispatch(getProjectNames());
	}, [dispatch])

    return (
		<div className='flex flex-col items-center justify-center
		w-screen min-h-screen bg-gunmetal box-border'>
			<Routes>
				<Route exact path='/' element={
					<ProtectedRoute
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
				<Route element={<AuthLayOut />}>
					<Route path='/auth' element={<Auth />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App;
