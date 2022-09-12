import React from 'react'
import { useSelector } from 'react-redux'
import { MdTaskAlt } from 'react-icons/md'
import { 
    FiInbox, 
    FiSettings, 
    FiFolder, 
    FiArchive
} from 'react-icons/fi'
import { BsChatDots } from 'react-icons/bs'

import { selectSidebar } from '../../redux/uiSlice'

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


const Sidebar = () => {
    const sidebar = useSelector(selectSidebar);
    
    return (
        <div className={`w-1/2 sm:w-[250px] px-2 py-2
        flex flex-col bg-timberwolf text-gunmetal
        dark:bg-gunmetal dark:text-ivory
        font-semibold absolute top-0 bottom-0
        z-10 sm:relative ${sidebar ? '' : 'hidden'}`} >
            <div className='flex flex-col gap-2 flex-1'>
                <Inbox />

                <Tasks />

                <ProjectGroup name='Projects' icon={<FiFolder />} />
                
                <Archive />

                <Messenger />

                <Settings />
            </div>
            <p>&copy; 2022 Serey Roth</p>
        </div>
    )
}

export default Sidebar