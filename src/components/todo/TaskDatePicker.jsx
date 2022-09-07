import React, { useState, useEffect} from 'react'

const TextButton = (props) => {
    const {children, isClicked, ...rest} = props;
    return (
        <button type='button' 
        className={`py-1 px-2 rounded-lg
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
        <div className='flex-1 flex flex-col border-t-2 
        py-2 gap-1 mt- border-slate-300'>
            <h2 className='font-semibold mb-1'>
                {clicked === '' ? 'When is this due?' :
                    'This it due ' + clicked.toLowerCase() + '.'
                }
            </h2>
            <span className='flex gap-1 mb-2 flex-wrap'>
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
            <span className='w-full text-center p-1 relative'>
			    <hr className='border-slate-400'></hr>
				<p className='absolute top-1/2 left-1/2
				-translate-x-1/2 -translate-y-1/2 z-10
				px-2 bg-ivory text-[10px]'>
					Or Choose Your Own
				</p>
			</span>
            {children}
        </div>
    )
}

export default TaskDatePicker