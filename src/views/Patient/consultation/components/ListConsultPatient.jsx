import React, { useState, useEffect } from 'react';
import { MdAssignmentTurnedIn, MdCheckCircle, MdCancel, MdOutlineError } from 'react-icons/md';
import { obtenirConsultationsPatientConnecte } from '../../../../api';
import { RiStethoscopeLine } from 'react-icons/ri';
import jwt_decode from "jwt-decode";

const ListConsultPatient = () => {
    const menuItems = ['Effacé', 'Item 2', 'Item 3'];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [consultations, setConsultations] = useState([]);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState([]);
    const token = localStorage.getItem('jwt');

    let patientId;

    if(token) {
        try {
            const decodedToken = jwt_decode(token);
            console.log(decodedToken);
            patientId = decodedToken._id;
        } catch (error) {
            console.error('Error decoding token:', error);
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    } else {
        console.log("No token found in localStorage");
        window.location.href = '/login';
    }

    useEffect(() => {
        fetchConsultations();
    }, [search, filters]);

    const fetchConsultations = async () => {
        try {
            let response = await obtenirConsultationsPatientConnecte(patientId, token);
            if (!response) response = [];
            if (search) {
                response = response.filter(consultation =>
                    consultation.patient?.nom?.toLowerCase().includes(search.toLowerCase()));
            }
            if (filters.length > 0) {
                response = response.filter(consultation =>
                    filters.includes(consultation.status));
            }
            console.log("Consultations: ", response);
            setConsultations(response);
        } catch (error) {
            console.error('Error fetching consultations:', error);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    }

    const formatRdvDate = (date) => {
        const dat = new Date(date);
        return dat.toISOString().split('T')[0];
    };

    const getIconForStatus = (statut) => {
        switch (statut) {
            case 'Confirmed':
                return <MdCheckCircle className="text-green-500" />;
            case 'Canceled':
                return <MdCancel className="text-red-500" />;
            case 'En Attente':
                return <MdOutlineError className="text-orange-500" />;
            default:
                return null;
        }
    };

    const filterOptions = ['Confirmed', 'Canceled', 'En Attente'];

    const handleFilterChange = (selectedFilters) => {
        setFilters(selectedFilters);
    };

    return (

        <section className="p-3 antialiased bg-gray-50 dark:bg-navy-900 sm:p-5">
            <div className="max-w-screen-xl px-1 mx-auto lg:px-19">
                <div className="relative overflow-hidden bg-white shadow-md dark:bg-navy-800 sm:rounded-lg">
                    <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
                        <div className="w-full md:w-1/2">
                            <form className="flex items-center">
                                <label for="simple-search" className="sr-only">Recherche</label>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="simple-search"
                                        value={search}
                                        onChange={handleSearchChange}
                                        className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Search"
                                        required=""
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
                            <div>


                                <div id="filterDropdown" className="z-10 hidden w-56 p-3 bg-white rounded-lg shadow dark:bg-gray-700">

                                    <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Category</h6>
                                    <ul className="space-y-2 text-sm" aria-labelledby="filterDropdownButton">
                                        <li className="flex items-center">
                                            <input id="apple" type="checkbox" value="" className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                            <label for="apple" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Apple (56)</label>
                                        </li>
                                        <li className="flex items-center">
                                            <input id="fitbit" type="checkbox" value="" className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                            <label for="fitbit" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Fitbit (56)</label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="h-40 max-w-screen-xl overflow-x">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead>
                            <tr>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                                    Patient
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                                    Médecin
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">
                                    Diagnostic
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {Array.isArray(consultations) && consultations.map((consultation) => (
                                <tr key={consultation.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 w-10 h-10">
                                                <RiStethoscopeLine className="w-10 h-10 text-gray-400" />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {consultation.patient?.nom} {consultation.patient?.prenom} // Nom du patient
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {consultation.medecin?.nom} {consultation.medecin?.prenom} // Nom du médecin
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatRdvDate(consultation.date)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        {consultation.status}
                                        {getIconForStatus(consultation.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {consultation.diagnostic}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                        <a href="#" className="text-primary-600 hover:text-primary-900">
                                            Modifier
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>

    );
}
export default ListConsultPatient;