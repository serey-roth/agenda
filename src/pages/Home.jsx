import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import decode from 'jwt-decode'

import { getTasks } from '../redux/todoSlice/tasks'
import { toggleSidebar, selectSidebar } from '../redux/uiSlice'
import { getProjectNames } from '../redux/todoSlice/projects'
import { logOut } from '../redux/authSlice'
import { reset } from '../redux/todoSlice/todoSlice'

import Header from '../components/styled/Header'
import Button from '../components/styled/Button'
import Sidebar from '../components/sidebar/Sidebar'
import DarkModeToggler from '../components/styled/DarkModeToggler'

const AuthButton = () => {
	const user = useSelector(state => state.auth.user)
	const dispatch = useDispatch();	
	const navigate = useNavigate();

	return (
		<Button addOnClass='rounded-md' onClick={() => {
			if (user) {
				dispatch(logOut());
				dispatch(reset());
			}
			navigate('/auth');
		}}>
			<p>{user ? 'Log Out' : 'Log In'}</p>
		</Button>
	)
}

const Home = () => {
	const user = useSelector(state => state.auth.user);
	const sidebar = useSelector(selectSidebar);
	
	const dispatch = useDispatch();	

	useEffect(() => {
		if (user) {
			dispatch(getProjectNames());
			dispatch(getTasks());
		}
	}, [dispatch, user])

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
        <div className='w-full flex flex-col h-screen relative'>
            <Header>
				<span className='w-full grid grid-cols-2'>
					<span className='flex gap-2 items-center'>
						<button onClick={() => 
							dispatch(toggleSidebar(!sidebar))}>
						<FaBars /></button>
						<h1 className='text-lg'>agenda</h1>
                		<DarkModeToggler />
					</span>
					<span className='flex gap-3 justify-self-end
					items-center capitalize'>
						{user && (
							<p className='flex-1'>
							Hello, {user.result?.name} !
							</p>
						)}
						<AuthButton />
					</span>
					<span>
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

export default Home