import React from 'react'
import { NavLink } from "react-router-dom";

const StyledNavLink = (props) => {
    const {icon, name, to} = props;

    const linkClass = `px-2 py-1 w-full hover:scale-110
    hover:translate-x-1 transition 
    duration-300 ease-in-out`

    return (
        <NavLink className={({isActive}) => (isActive ? 
            `text-blush mix-blend-lighten 
            italic underline underline-offset-8 ` : '') 
            + linkClass} to={to}>
            <span className='w-full flex gap-2 items-center'>
                {icon}
                <p>{name}</p>
            </span>
        </NavLink>
  )
}

export default StyledNavLink