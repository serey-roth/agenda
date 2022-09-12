import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { FiSquare } from 'react-icons/fi'
import {
    FiChevronDown, 
    FiChevronUp, 
    FiFolderPlus 
} from 'react-icons/fi'

import Element from "./Element"
import StyledNavLink from './StyledNavLink'
import AddProject from '../todo/AddProject'
import { selectAllProjectNames } from '../../redux/todoSlice/todoSlice'

const ProjectGroup = (props) => {
    const {
        addOnClass, 
        children, 
        addPanel,
        name,
        ...rest
    } = props;

    const projects = useSelector(selectAllProjectNames);

    const [collapse, setCollapse] = useState(projects?.length === 1);

    useEffect(() => {
        if (projects?.length > 1) {
            setCollapse(prevState => !prevState);
        }
    }, [projects]);

    const [
        addProjectVisible, 
        setAddProjectVisible
    ] = useState(false);

    const handleToggleAddProject = () => {
        if (collapse || (!collapse && projects.length <= 1)) {
            setCollapse(prevState => !prevState);
        }
        setAddProjectVisible(prevState => !prevState);
    }

    const handleCollapse = () => {
        if (projects.length > 1 || addProjectVisible) {
            setCollapse(prevState => !prevState);
            if (addProjectVisible) {
                setAddProjectVisible(prevState => !prevState);
            }
        }
    }

    const projectsElements = projects.slice(1).map(projectKey => 
        <StyledNavLink 
            key={projectKey}
            icon={<FiSquare />}
            to={`/projects/${projectKey}`}
            name={projectKey} 
        />
    )

    const groupClass = `flex flex-col gap-1
    ${addOnClass ? addOnClass : ''} ${!collapse ? 
    `bg-slate-400 text-gunmetal text-md
    rounded-lg py-2` : ''}`

    return (
        <div className={groupClass}>
            <div className='flex items-center'>
                <Element onClick={handleCollapse} {...rest}>
                    <p>{name}</p>
                </Element>
                
                <button className={`hover:ring rounded-full 
                p-1 transition duration-400
                delay-75 ease-in`}
                onClick={handleToggleAddProject}>
                    <FiFolderPlus />
                </button>

                <button className='hover:ring rounded-full 
                p-1 transition duration-400 
                delay-75 ease-in'
                onClick={handleCollapse}>
                    {!collapse ? <FiChevronUp /> : <FiChevronDown />}
                </button>

            </div>
            {!collapse ? 
                <>
                    {projects.length > 1 ? 
                        <div className={(!collapse ? 
                        'flex flex-col ' : 'hidden ') +
                        'text-[10px] grow gap-1 pl-4 mb-1'}>
                            {projectsElements}
                        </div> : null
                    }
                    {(addProjectVisible ? 
                        <div className='flex flex-col text-[10px] 
                            grow gap-1 px-2 mb-1'>
                            <AddProject 
                            visible={addProjectVisible}
                            onToggle={handleToggleAddProject}/>
                        </div> : null)
                    }
                </> : null
            }
        </div>
    )
}

export default ProjectGroup