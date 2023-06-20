import React, { useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

export default function ConsultationModal({ patient, closeModal }) {
    const [diagnostic, setDiagnostic] = useState('');


    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('jwt');
        const decodedToken = jwt_decode(token);
        console.log(token);
        const medecinId = decodedToken._id;
        if (!medecinId) {
            console.error("Impossible de récupérer l'ID du médecin");
            return;
        }

        const newConsultation = {
            medecin: medecinId,
            patient: patient._id,
            date: new Date(),
            diagnostic: diagnostic,
            prescriptions: [],
        };

        try {
            const response = await axios.post(
                'http://localhost:5000/consultation',
                newConsultation,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                console.log("Consultation ajoutée avec succès");
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de la consultation", error);
        }

    };


    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm bg-opacity-50">
            <div className="bg-white dark:bg-navy-700 rounded-lg shadow-lg w-full max-w-md">
                <div className="p-4" style={{ maxHeight: "95vh", overflowY: "auto" }}>
                    <div className="flex justify-between items-center pb-4 mb-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ajouter Consultation</h3>
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

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="diagnostic" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Diagnostic</label>
                            <textarea name="diagnostic" id="diagnostic" onChange={e => setDiagnostic(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Saisissez le diagnostic" required="" />
                        </div>

                        <div className="mt-4">
                            <button type="submit" className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 border text-navy-500 border-transparent rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                Ajouter
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
