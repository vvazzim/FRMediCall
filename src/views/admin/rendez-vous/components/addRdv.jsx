import React, { useEffect, useState } from 'react';
import { obtenirMedecins, obtenirCabinetsMedicaux, ajouterRdv, obtenirPatient } from '../../../../api';

const AjouterRDV = ({ closeModal }) => {
    const [medecins, setMedecins] = useState([]);
    const [cabinets, setCabinets] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedMedecin, setSelectedMedecin] = useState('');
    const [selectedCabinet, setSelectedCabinet] = useState('');
    const [selectedPatient, setSelectedPatient] = useState('');
    const [rdvData, setRdvData] = useState({ date: '', heureDebut: '', heureFin: '' });

    useEffect(() => {
        obtenirMedecins().then(setMedecins);
        obtenirCabinetsMedicaux().then(setCabinets);
        obtenirPatient().then(setPatients);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const rdv = {
            patientId: selectedPatient,
            medecinId: selectedMedecin,
            cabinetId: selectedCabinet,
            date: rdvData.date,
            heureDebut: rdvData.heureDebut,
            statut: 'En attente de validation',
        };

        try {
            const response = await ajouterRdv(rdv);
            if (response.status === 200) {
                closeModal();
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout du RDV", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm bg-opacity-50">
            <div className="bg-white dark:bg-navy-700 rounded-lg shadow-lg w-full max-w-md">
                <div className="p-4">
                    <div className="flex justify-between items-center pb-4 mb-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ajouter RDV</h3>
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
                            <label htmlFor="patientId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                ID du patient
                            </label>
                            <select
                                name="patientId"
                                id="patientId"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value={selectedPatient}
                                onChange={(e) => setSelectedPatient(e.target.value)}
                                required
                            >
                                <option value="">Sélectionnez un patient</option>
                                {patients.map((patient) => (
                                    <option key={patient._id} value={patient._id}>
                                        {patient.nom} {patient.prenom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="medecinId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Médecin
                            </label>
                            <select
                                name="medecinId"
                                id="medecinId"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value={selectedMedecin}
                                onChange={(e) => setSelectedMedecin(e.target.value)}
                                required
                            >
                                <option value="">Sélectionnez un médecin</option>
                                {medecins.map((medecin) => (
                                    <option key={medecin._id} value={medecin._id}>
                                        {medecin.nom} {medecin.prenom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="cabinetId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Cabinet médical
                            </label>
                            <select
                                name="cabinetId"
                                id="cabinetId"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value={selectedCabinet}
                                onChange={(e) => setSelectedCabinet(e.target.value)}
                                required
                            >
                                <option value="">Sélectionnez un cabinet médical</option>
                                {cabinets.map((cabinet) => (
                                    <option key={cabinet._id} value={cabinet._id}>
                                        {cabinet.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                id="date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value={rdvData.date}
                                onChange={(e) => setRdvData({ ...rdvData, date: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="heureDebut" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Heure de début
                            </label>
                            <input
                                type="time"
                                name="heureDebut"
                                id="heureDebut"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value={rdvData.heureDebut}
                                onChange={(e) => setRdvData({ ...rdvData, heureDebut: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <button
                                type="submit"
                                className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Ajouter
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AjouterRDV;
