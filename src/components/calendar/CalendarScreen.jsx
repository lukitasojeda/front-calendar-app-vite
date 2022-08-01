import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import moment from 'moment';
import 'moment/locale/es';

import { Navbar } from '../ui/Navbar';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';

import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';

import { uiOpenModal } from '../../store/slices/uiSlice';
import {
    eventClearActiveEvent,
    eventSetActive
} from '../../store/slices/calendarSlice';

import { eventStartLoaded } from '../../store/thunks/events';

import { prepareEvents } from '../../helpers/prepareEvents';
import { messages } from '../../helpers/calendar-messages-es';

import '../../styles.css';

moment.locale('es');
const localizer = momentLocalizer(moment);


/**
 * Este componente es la vista principal de la aplicación que contiene los componentes 
 * que hacen al funcionamiento de la misma.
 * @module CalendarScreen
 */
export const CalendarScreen = () => {

    const dispatch = useDispatch();

    const { activeEvent } = useSelector(state => state.calendar);

    const { events } = useSelector(state => state.calendar);

    const { uid } = useSelector(state => state.auth);

    /**
     * El siguiente useState es para guardar los valores del ultimo lugar en el cuál el 
     * usuario estuvo, para llevarlo allí en el proximo inicio de sesión.
     */
    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

    /**
     * El siguiente useEffect se encarga de volver a cargar el array de eventos cada vez 
     * que se renderice este componente.
     */
    useEffect(() => {

        dispatch(eventStartLoaded())

    }, [dispatch]);

    /**
     * La siguiente función abre el modal que edita los eventos.
     */
    const onDoubleClick = (e) => {
        dispatch(uiOpenModal());
    }

    /**
     * La siguiente función marca el evento seleccionado por el usuario como activo 
     * para poder ser editado o eliminado.
     */
    const onSelectEvent = (e) => {

        const eventSelected = events.filter(event => (event._id === e._id) && event);

        dispatch(eventSetActive(eventSelected[0]));
    }

    /**
     * La siguiente función quita el evento que esté como activo de dicha situación.
     */
    const onSelectSlot = (e) => {
        dispatch(eventClearActiveEvent());
    }

    /**
     * La siguiente función guarda en localStorage el lugar donde se encuentre el usuario 
     * cada vez que el mismo cambie de vista dentro de la aplicación.
     */
    const onViewChange = (e) => {
        setLastView(e);
        localStorage.setItem('lastView', e);
    }

    /**
     * La siguiente función se encarga de los estilos del Calendar.
     */
    const eventStyleGetter = (event, start, end, isSelected) => {

        const style = {
            backgroundColor: (uid === event.user.uid) ? '#367CF7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            display: 'block',
            color: 'white'
        }


        return {
            style
        }
    }

    /**
     * Preparamos los eventos con el formato adecuado.
     */
    const preparedEvents = prepareEvents(events);

    return (
        <div className='calendar-screen'>

            <Navbar />


            <Calendar
                localizer={localizer}
                events={preparedEvents}
                startAccessor="start"
                endAccessor="end"
                messages={messages}
                eventPropGetter={eventStyleGetter}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelectEvent}
                onSelectSlot={onSelectSlot}
                selectable={true}
                onView={onViewChange}
                view={lastView}
                components={{
                    event: CalendarEvent
                }}

            />


            <AddNewFab />

            {
                (activeEvent) && <DeleteEventFab />
            }

            <CalendarModal />

        </div>
    );
};