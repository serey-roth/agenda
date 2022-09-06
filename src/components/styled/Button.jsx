import React from 'react'

const Button = ({children, addOnClass, ...props}) => {
    const buttonClass = `p-2 rounded-full border-2
    hover:shadow-lg hover:scale-105 transition ease-in-out
    duration-300 text-ivory bg-gunmetal flex justify-center `+ 
    (addOnClass ? addOnClass : '');
    
    return (
        <button className={buttonClass} {...props}>
            <span className='flex items-center gap-1'>
                {children}
            </span>
        </button>
    )
}

export default Button