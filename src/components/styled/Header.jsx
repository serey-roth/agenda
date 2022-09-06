import React from 'react'

const Header = ({children}) => {
    return (
        <div className='bg-blush w-full px-3 py-2 gap-2
        text-white flex items-center font-bold'>
            {children}
        </div>
    )
}

export default Header