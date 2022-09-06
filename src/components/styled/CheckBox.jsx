import React from 'react'

const CheckBox = ({children, ...props}) => {
    return (
        <span className='px-1 flex gap-1'>
			<input type='checkbox' {...props} />
            {children}
		</span>
    )
}

export default CheckBox