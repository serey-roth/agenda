import React, { useState, useEffect} from 'react'

const TextButton = (props) => {
    const {children, isClicked, ...rest} = props;
    return (
        <button type='button' 
        className={`p-2 rounded-lg
        hover:ring border-2 border-pink-500
        transtion duration-300 ease-in-out` +
        (isClicked ? ' bg-gunmetal text-ivory' :
        ' bg-ivory text-gunmetal')}
        {...rest}>
            {children}
        </button>
    )
}

const TaskDatePicker = ({children, specificEndDate,
    onSpecificEndDate}) => {
    const [clicked, setClicked] = useState(specificEndDate ? 
        specificEndDate : '');

    useEffect(() => {
        if (!specificEndDate) {
                setClicked('');
        }
     }, [specificEndDate]);
    

    const handleClick = (e) => {
        if (clicked !== e.target.innerText) {
            onSpecificEndDate(e.target.innerText);
            setClicked(e.target.innerText);
        } else {
            onSpecificEndDate(null);
            setClicked('');
        }
    }

    return (
        <div className='flex flex-1 flex-col border-t-2 
        py-2 gap-1 border-slate-300'>
            {children}
            <span className='w-full text-center p-1 my-3 relative'>
			    <hr className='border-slate-400'></hr>
				<p className='absolute top-1/2 left-1/2
				-translate-x-1/2 -translate-y-1/2 z-10
				px-1 bg-timberwolf dark:bg-gunmetal text-[12px] w-2/3'>
					Or Choose a Due Date from Today
				</p>
			</span>
            <span className='flex gap-1 flex-wrap'>
                <TextButton 
                isClicked={clicked === 'Today'} 
                onClick={handleClick}>
                    Today
                </TextButton>
                <TextButton 
                isClicked={clicked === 'Tomorrow'} 
                onClick={handleClick}>
                    Tomorrow
                </TextButton>
                <TextButton 
                isClicked={clicked === 'This Weekend'} 
                onClick={handleClick}>
                    This Weekend
                </TextButton>
                <TextButton 
                isClicked={clicked === 'Next Week'} 
                onClick={handleClick}>
                    Next Week
                </TextButton>
            </span>
        </div>
    )
}

export default TaskDatePicker