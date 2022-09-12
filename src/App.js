import React, { useLayoutEffect } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { authPersisted } from './redux/authSlice'

import TaskEditor from './components/todo/TaskEditor';
import Auth from './pages/Auth'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import Projects from './pages/Projects'
import ErrorPage from './pages/ErrorPage';

const AuthLayOut = () => {
	return (
		<div className='w-screen h-screen max-w-[500px]
		max-h-[500px] flex flex-col bg-ivory text-gunmetal
		items-center justify-center relative
		dark:bg-gunmetal dark:text-ivory
		sm:rounded-md drop-shadow-2xl shadow-slate-100'>
			<Outlet />
		</div>
	)
}

function App() {
	const dispatch = useDispatch();

	useLayoutEffect(() => {
		const user = localStorage.getItem('currentUser')
		if (user) {
			dispatch(authPersisted(user ? JSON.parse(user) : null));
		}
	}, [dispatch])

    return (
		<div className='flex flex-col items-center justify-center
		w-screen min-h-screen bg-gray-500 box-border'>
			<Routes>
				<Route exact path='/' element={<Home />}>
					<Route index element={<Tasks />} />
					<Route path='tasks' element={<Tasks />}>
						<Route path=':taskId' 
						element={<TaskEditor />} />
					</Route>
					<Route path='projects/:title' element={<Projects />}>
						<Route path='task/:taskId' element={<TaskEditor />} />
					</Route>
				</Route>
				<Route element={<AuthLayOut />}>
					<Route path='/auth' element={<Auth />} />
				</Route>
				<Route path='*' element={<ErrorPage />} />
			</Routes>
		</div>
	);
}

export default App;
