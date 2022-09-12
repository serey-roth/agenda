import React from 'react'

const Header = ({children}) => {
    return (
        <div className='bg-gunmetal dark:bg-slate-500
        w-full p-3 gap-2
        text-white flex items-center font-bold'>
            {children}
        </div>
    )
}

export default Header