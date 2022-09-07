import React from 'react'
import { MdAddTask } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import {
    selectTaskMaker, 
    selectTaskEditor,
    toggleTaskMaker,
} from '../../redux/uiSlice'

const AddTaskButton = () => {
    const dispatch = useDispatch();
    const taskmaker = useSelector(selectTaskMaker);
    const taskeditor = useSelector(selectTaskEditor);


    return (
        <button className={`rounded-full p-3 
        bg-blush text-ivory text-lg
        shadow-slate-300
        hover:scale-110 hover:ring-slate-300
        transition duration-300 ease-in-out
        absolute z-10 bottom-5 right-5 
        ${taskmaker.visible || taskeditor ? 'hidden' : ''}`}
        onClick={() => dispatch(toggleTaskMaker(!taskmaker.visible))}> 
            <MdAddTask />
        </button>
    )
}

export default AddTaskButton