import React from 'react'
import {FaSpinner} from 'react-icons/fa'
const Loading = ({color}) => {
    return (
        <div className={`flex-1 flex gap-2 flex-col items-center
        justify-center backdrop-contrast-50 text-lg z-50
        absolute top-0 bottom-0 right-0 left-0  ${color}`}>
            <FaSpinner className={`animate-spin w-[50px]
            h-[50px]`} />
            <p className='underline underline-offset-8'>Tasks Loading...</p>
        </div>
    )
}

export default Loading