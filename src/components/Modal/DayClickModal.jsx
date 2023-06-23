    import React, { useState } from 'react';
    import {Axios as axios} from "axios";

    const DayClickModal = ({ closeModal, onSubmit }) => {
        const [title, setTitle] = useState('');
        const [startTime, setStartTime] = useState('');
        const [endTime, setEndTime] = useState('');

        const handleSubmit = async () => {
            console.log("DayClickModal handleSubmit invoked with title:", title, "startTime:", startTime, "and endTime:", endTime);
            const jwtToken = localStorage.getItem('jwtToken');

            if (!jwtToken) return;

            console.log("DayClickModal handleSubmit: preparing to call onSubmit...");

            try {
                const response = await onSubmit(title, startTime, endTime);
                console.log("DayClickModal handleSubmit: onSubmit called successfully");

                if (response.status === 200) {
                    console.log("New event created: ", response.data);
                    setTimeout(() => {
                        closeModal();
                    }, 1000);
                }
            } catch (error) {
                console.error(error);
                alert("An error occurred while creating the event. Please try again.");
            }
        };


        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm bg-opacity-50">
                <div className="bg-white dark:bg-navy-700 rounded-lg shadow-lg w-50 max-w-md">
                    <div className="p-4">
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ORGANISE TES RENDEZ-VOUS</h3>
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                                onClick={closeModal}
                            >
                                <svg
                                    aria-hidden="true"
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Titre
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Heure de début
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Heure de fin
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>

                        <button
                            type="button"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => {
                                console.log('Button clicked. Calling onSubmit...');
                                onSubmit(title, startTime, endTime);
                            }}
                        >
                            Organiser
                        </button>

                    </div>
                </div>
            </div>
        );
    };

    export default DayClickModal;
