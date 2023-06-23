import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import DayClickModal from '../Modal/DayClickModal';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const MiniCalendar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const mountedRef = useRef(true);

    const localizer = momentLocalizer(moment);

    useEffect(() => {
        const Token = localStorage.getItem('jwt');
        if (Token) {
            setToken(Token);
        }
        return () => {
            mountedRef.current = false;
        }
    }, [token]);

    useEffect(() => {
        const fetchEvents = async () => {
            if (!token) return;
            setLoading(true);
            setError(null);
            const { medecinId } = jwtDecode(token);
            try {
                const response = await axios.get(`https://localhost:5000/agendas/event/${medecinId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (mountedRef.current) {
                    setEvents(response.data.map(event => ({
                        title: event.title,
                        start: new Date(event.date),
                        end: new Date(event.date),
                    })));
                    setLoading(false);
                }
            } catch (error) {
                if (mountedRef.current) {
                    console.error(error);
                    setError('An error occurred while fetching the events.');
                    setLoading(false);
                }
            }
        };

        fetchEvents();
    }, [token]);

    const handleSubmit = async (title, startTime, endTime) => {
        console.log("handleSubmit invoked with title:", title, "startTime:", startTime, "and endTime:", endTime);

        if (!token) return;

        console.log("Preparing to send request...");

        axios.post(`https://localhost:5000/agendas/events`, {
            title,
            start: startTime,
            end: endTime,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                if (response.status === 200) {
                    const newEvent = response.data;
                    console.log("New event created: ", newEvent);
                    setEvents([...events, newEvent]);
                    setTimeout(() => {
                        setIsModalOpen(false);
                    }, 1000);
                }
            })
            .catch(error => {
                console.error(error);
                alert("An error occurred while creating the event. Please try again.");
            })
            .finally(() => {
                console.log("Request sent!");
            });
    };


    const handleDateClick = (arg) => {
        console.log("Date clicked: ", arg.dateStr);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="p-4 mt-4 bg-white rounded-lg dark:bg-navy-100">
            <div>
                <div className="mt-5">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        locale={frLocale}
                        headerToolbar={{
                            start: 'today prev,next',
                            center: 'title',
                            end: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        height="75vh"
                        events={events}
                        selectable={true}
                        dayCellClassNames="cursor-pointer rounded-lg hover:bg-blue-200 font-bold"
                        dateClick={handleDateClick}
                    />
                    {isModalOpen && <DayClickModal closeModal={closeModal} onSubmit={handleSubmit}/>}
                </div>
            </div>
        </div>
    );
};

export default MiniCalendar;
