import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { RiMoonClearFill, RiSunFill } from 'react-icons/ri'

import { toggleDarkMode } from '../../redux/uiSlice';

import Button from './Button'

const DarkModeToggler = ({addOnClass}) => {
	const dispatch = useDispatch();
	const darkMode = useSelector(state => state.ui.darkMode);

	const handleToggle = () => {
		dispatch(toggleDarkMode());
	}

	return (
		<Button addOnClass={`text-lg ${addOnClass ? addOnClass : ''}`} 
		type='button'
		onClick={handleToggle}>
			{darkMode ? <RiSunFill /> : <RiMoonClearFill />}
		</Button>
	)
}

export default DarkModeToggler