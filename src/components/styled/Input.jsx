import React from 'react'
import { MdError } from 'react-icons/md'

const Input = (props) => {
    const {
        label, 
        touched, 
        error,
        children,
        addOnClass,
        ...rest
    } = props;

    const labelClass = 'px-1 ' + (touched && error ? 'text-red-500' : '');
    const inputClass = `px-3 py-2 rounded-full focus:ring text-gunmetal
    transition duration-300 ease-in-out shadow-sm shadow-slate-200 
    ${addOnClass ? addOnClass : ''}`;

    return (
        <span className='flex flex-col w-full gap-1'>
            <label className={labelClass}>{label}</label>
			<input className={inputClass} {...rest} />
            {touched && error ? 
                <span className='px-1 flex items-center gap-1'>
                    <MdError className='text-gunmetal text-[1.4em]'/>
                    <p className='font-semibold italic text-red-500'>{error}</p>
                </span> : 
                null}
            {children}
		</span>
    )
}

export default Input