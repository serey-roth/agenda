import React from 'react';

const Element = (props) => {
    const {icon, children, ...rest} = props;

    return (
        <div className='flex gap-2 px-2 py-1 items-center
        w-full cursor-pointer hover:scale-110 transition 
        duration-300 ease-in-out' {...rest}>
            {icon}
            {children}
        </div>
  )
}

export default Element