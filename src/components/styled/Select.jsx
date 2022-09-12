import React from 'react'

const Select = ({label, addOnClass, ...props}) => {
    const selectClass = `px-2 py-2 rounded-full focus:ring
    transition duration-300 ease-in-out shadow-sm text-gunmetal
    shadow-slate-200 ${addOnClass ? addOnClass : ''}`

    return (
        <span className='flex flex-col w-full gap-1'>
            <label className='px-1'>{label}</label>
			<select className={selectClass} {...props} />
		</span>
    )
}

export default Select