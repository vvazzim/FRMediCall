import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import DayClickModal from '../Modal/DayClickModal';
import jwtDecode from 'jwt-decode';

const MiniCalendar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('No token found');
            }
            const {medecinId} = jwtDecode(token);
            try {
                const response = await axios.get(`https://localhost:5000/agenda/event/${medecinId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                // Assurez-vous que les événements sont formatés correctement pour FullCalendar
                setEvents(response.data.map(event => ({
                    title: event.title, // Assurez-vous que le champ 'title' existe dans votre data
                    date: event.date, // Assurez-vous que le champ 'date' existe dans votre data
                })));
            } catch (error) {
                console.error(error);
            }
        };

        fetchEvents();
    }, []);

    const handleDateClick = (arg) => {
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
            />
            {isModalOpen && <DayClickModal closeModal={closeModal}/>}
        </div>
    );
};

export default MiniCalendar;
