import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConsultationModal from './ConsultationModal';

const PatientConsultationModal = (props) => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
    const [doctorId, setDoctorId] = useState(1); // vous pouvez changer ce 1 en une valeur spécifique pour les tests

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://localhost:5000/Utilisateur?typeUtilisateur=Patient');
            setPatients(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des patients", error);
        }
    };

    const onSelectPatient = (patient) => {
        console.log(patient);
        setSelectedPatient(patient);
        setIsConsultationModalOpen(true);
    };

    const closeConsultationModal = () => {
        setSelectedPatient(null);
        setIsConsultationModalOpen(false);
    };

    const { closeModal } = props;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm bg-opacity-50">
            <div className="bg-white dark:bg-navy-700 rounded-lg shadow-lg w-full max-w-md">
                <div className="p-4" style={{ maxHeight: "95vh", overflowY: "auto" }}>
                    <div className="flex justify-between items-center pb-4 mb-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Liste des patients</h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                            onClick={() => {
                                closeModal();
                            }}
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
                    {patients.map(patient => (
                        <div key={patient.id} className="mb-4 p-2 border rounded">
                            <h3>{patient.nom} {patient.prenom}</h3>
                            <button onClick={() => onSelectPatient(patient)}>Choisir ce patient</button>
                        </div>
                    ))}
                </div>
            </div>
            {/* Consultation modal */}
            {console.log(isConsultationModalOpen, selectedPatient, doctorId)}
            {isConsultationModalOpen && selectedPatient && doctorId && (
                <ConsultationModal
                    patient={selectedPatient}
                    doctorId={doctorId}
                    closeModal={closeConsultationModal}
                />
            )}
        </div>
    );
}

export default PatientConsultationModal;
