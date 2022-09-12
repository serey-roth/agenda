import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns'

import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

import { 
    selectAllTasks, selectTaskById
} from '../../redux/todoSlice/todoSlice';
import { 
    toggleTaskEditor,
    toggleTaskMaker,
    dateSelectTaskMaker,
    getPriorityColor,
} from '../../redux/uiSlice'
import { updateTask } from '../../redux/todoSlice/tasks';

const EventObject = ({id, view}) => {
    const task = useSelector(selectTaskById(id));

    return (
        <span className={`flex flex-col w-full h-full 
        gap-[5px] p-1 pl-2 text-md text-black
        ${getPriorityColor(task.priority)} 
        hover:drop-shadow-sm hover:translate-x-2 
        transiton duration-300 ease-in-out `}>
            {(view !== 'listWeek' && !task.allDay) && (
            <p>
            {format(new Date(task.start), 'hh:mm a')} - 
            {format(new Date(task.end), 'hh:mm a')}
            </p>)}
            <p className={`flex-1 font-semibold select-none
            drop-shadow-sm ${task.isCompleted ? 
            'line-through italic opacity-50' : ''}`}>
            {task.title}
            </p>
        </span>
    )
}

const CalendarView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(state => state.auth.user);
    const tasks = useSelector(selectAllTasks);
    const ui = useSelector(state => state.ui);

    const events = tasks.map(task => ({
        id: task._id,
        title: task.title,
        start: task.start,
        end: task.end,
        allDay: task.allDay,
    }));

    const handleEventMove = (info) => {
        const task = tasks.find(t => t._id === info.event.id);
        const payload = {
            ...task, 
            start: format(new Date(info.event.start), 
            "yyyy-MM-dd'T'HH:mm"),
            end: format(new Date(info.event.end), 
            "yyyy-MM-dd'T'HH:mm")
        }
        dispatch(updateTask({id: task._id, updatedTask: payload}));
    }

    const handleEventClick = (info) => {
        navigate(location.pathname + `/${info.event.id}`);
        dispatch(toggleTaskEditor(true));
    }

    const handleDateSelect = (info) => {
        const {start, end} = info
        dispatch(dateSelectTaskMaker({
            start: format(new Date(start), "yyyy-MM-dd'T'HH:mm"),
            end: format(new Date(end), "yyyy-MM-dd'T'HH:mm"),
        }));
        dispatch(toggleTaskMaker(true));
    }
    
    const renderEvent = (arg) => {
        return (
            <>
                <EventObject id={arg.event.id} view={arg.view.type}/>
            </>
        )
    }

    return (
        <div className={`flex flex-1 flex-col relative 
        ${ui.taskmaker.visible || ui.taskeditor ? `cursor-not-allowed 
        pointer-events-none brightness-50 contrast-150
        opacity-50` : ''}`}>
            <FullCalendar
            plugins={[ interactionPlugin, 
                dayGridPlugin, 
                timeGridPlugin, 
                listPlugin ]}
            initialView='timeGridDay'
            selectable={!(ui.taskmaker.visible || ui.taskeditor)}
            headerToolbar={{
                left: 'title',
                right: 'prev,next today',
                center: 'dayGridMonth, timeGridWeek, timeGridDay, listWeek'
            }}
            navLinks={true}
            eventDurationEditable={true}
            dayMaxEvents={true}
            events={events}
            eventBackgroundColor='#e75a7c'
            eventTextColor='#f2f5ea'
            eventOrder='duration'
            eventResize={handleEventMove}
            nowIndicator={true}
            eventClick={!(ui.taskmaker.visible || ui.taskeditor) ? handleEventClick : 
            () => {}}
            select={!(ui.taskmaker.visible || ui.taskeditor || !user) ? handleDateSelect : 
                () => {}}
            scrollTime={format(new Date(), 'HH:mm:ss')}
            eventContent={renderEvent}
            />
        </div>
    );
}

export default CalendarView