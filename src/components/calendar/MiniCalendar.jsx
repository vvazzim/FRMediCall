import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import frLocale from '@fullcalendar/core/locales/fr';
import DayClickModal from '../Modal/ClickModal';

const MiniCalendar = () => {
    const [events, setEvents] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="p-4 mt-4 bg-white rounded-lg dark:bg-navy-100">
            {modalOpen && <DayClickModal closeModal={() => setModalOpen(false)} />}
            <div>
                <div className="mt-5">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin]}
                        initialView="dayGridMonth"
                        locale={frLocale}
                        headerToolbar={{
                            start: 'today prev,next',
                            center: 'title',
                            end: 'dayGridMonth,timeGridWeek,timeGridDay,multiMonthYear',
                        }}
                        height="75vh"
                        events={events}
                        selectable={true}
                        select={() => setModalOpen(true)}
                        dayCellClassNames="cursor-pointer rounded-lg hover:bg-blue-200 font-bold "

                    />
                </div>
            </div>
        </div>
    );
};

export default MiniCalendar;