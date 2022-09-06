import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns'

import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

import { taskUpdated, selectAllTasks } from './todoSlice';
import { 
    toggleTaskEditor, 
    selectTaskEditor, 
    selectTaskMaker,
    toggleTaskMaker,
    dateSelectTaskMaker
} from '../redux/uiSlice'

const CalendarView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const tasks = useSelector(selectAllTasks);
    const taskeditor = useSelector(selectTaskEditor);
    const taskmaker = useSelector(selectTaskMaker);

    const events = tasks.map(task => ({
        id: task.id,
        title: task.title,
        start: task.start,
        end: task.end,
        allDay: task.allDay,
    }));

    const handleEventMove = (info) => {
        const payload = {
            id: info.event.id,
            title: info.event.title,
            start: format(new Date(info.event.start), "yyyy-MM-dd'T'hh:mm"),
            end: format(new Date(info.event.end), "yyyy-MM-dd'T'hh:mm")
        }
        dispatch(taskUpdated(payload));
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
    
    return (
        <div className={`flex flex-1 flex-col relative 
        ${taskmaker.visible || taskeditor ? `cursor-not-allowed 
        pointer-events-none contrast-50` : ''}`}>
            <FullCalendar
            plugins={[ interactionPlugin, 
                dayGridPlugin, 
                timeGridPlugin, 
                listPlugin ]}
            initialView='timeGridDay'
            selectable={!(taskmaker.visible || taskeditor)}
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
            eventClick={!(taskmaker.visible || taskeditor) ? handleEventClick : 
            () => {}}
            select={!(taskmaker.visible || taskeditor) ? handleDateSelect : 
                () => {}}
            scrollTime={format(new Date(), 'HH:mm:ss')}
            />
        </div>
    );
}

export default CalendarView