import React from 'react'

const CheckBox = ({children, addOnClass, ...props}) => {
    return (
        <span className={`px-1 flex gap-1 
        ${addOnClass ? addOnClass : ''}`}>
			<input type='checkbox' {...props} />
            {children}
		</span>
    )
}

export default CheckBox