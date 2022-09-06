import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { MdTaskAlt } from 'react-icons/md'
import { 
    FiInbox, 
    FiSettings, 
    FiFolder, 
    FiLogIn,
    FiLogOut,
    FiArchive
} from 'react-icons/fi'
import { BsChatDots } from 'react-icons/bs'

import { logOut } from '../../auth/authSlice'
import { selectSidebar } from '../../redux/uiSlice'

import Element from './Element'
import StyledNavLink from './StyledNavLink'
import ProjectGroup from './ProjectGroup';

const Inbox = () => (
    <StyledNavLink 
        icon={<FiInbox />}
        to='/projects/Inbox'
        name='Inbox'
    />
)


const Archive = () => (
    <StyledNavLink 
        icon={<FiArchive />}
        to='/archive' 
        name='Archive' 
    />
)

const Tasks = () => (
    <StyledNavLink 
        icon={<MdTaskAlt />}
        to='/tasks' 
        name='Tasks' 
    />
)

const Messenger = () => (
    <StyledNavLink 
        icon={<BsChatDots />}
        to='/messenger' 
        name='Messenger' 
    />
)

const Settings = () => (
    <StyledNavLink 
        icon={<FiSettings />}
        to='/settings' 
        name='Settings' 
    />
)

const LogIn = () => (
    <StyledNavLink 
        icon={<FiLogIn />}
        to='/auth' 
        name='Log In' 
    />
)

const Sidebar = () => {
    const sidebar = useSelector(selectSidebar);
    const { user, loggedIn } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
		if (!user) {
			navigate('/auth');
		} 
	}, [user, navigate]); 

    const LogOut = () => (
        <Element icon={<FiLogOut />} 
        onClick={() => {
            dispatch(logOut());
        }}>
            <p>Log Out</p>
        </Element>
    )

    return (
        <div className={`w-1/2 sm:w-[250px] px-2 py-2
        flex flex-col gap-1 bg-gunmetal text-ivory 
        text-[14px] font-semibold absolute top-0 bottom-0
        z-10 sm:relative ${sidebar ? '' : 'hidden'}`} >
            <Inbox />

            <Tasks />

            <ProjectGroup name='Projects' icon={<FiFolder />} />
            
            <Archive />

            <Messenger />

            <Settings />

            {!loggedIn ? <LogIn /> : <LogOut />}
        </div>
    )
}

export default Sidebar