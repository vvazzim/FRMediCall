import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { MdAssignmentTurnedIn, MdCheckCircle, MdCancel, MdOutlineError } from 'react-icons/md';
import AjouterRDV from './addRdv';
import { obtenirRdv } from '../../../../api';
import ActionDropdown from '../../../../components/dropdown/ActionDropdown';

const RdvList = () => {
    const menuItems = ['Effacé', 'Item 2', 'Item 3'];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rdvs, setRdvs] = useState([]);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState([]);

    // Get the medecin's ID from the token
    const token = localStorage.getItem('jwt');

    let medecinId;

    if(token) {
        try {
            const decodedToken = jwt_decode(token);console.log(decodedToken);

            medecinId = decodedToken._id;
        } catch (error) {
            console.error('Error decoding token:', error);
            localStorage.removeItem('token'); // Remove the invalid token
            window.location.href = '/login'; // Redirect to the login page
        }
    } else {
        console.log("No token found in localStorage");
        window.location.href = '/login'; // Redirect to the login page
    }

    useEffect(() => {
        const fetchRdvs = async () => {
            if (!medecinId) return;  // If medecinId is null, skip fetching rdvs.
            try {
                let response = await obtenirRdv(medecinId);
                if (!response) {
                    console.error('No RDVs received');
                    return;
                }
                if (search) {
                    response = response.filter(rdv =>
                        rdv.patient?.nom?.toLowerCase().includes(search.toLowerCase()));
                }
                if (filters.length > 0) {
                    response = response.filter(rdv =>
                        filters.includes(rdv.statut));
                }
                setRdvs(response);
            } catch (error) {
                console.error('Error fetching RDVs:', error);
            }
        };
        fetchRdvs();
    }, [search, filters, medecinId]);

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
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6 dark:text-white">
            <div className="w-full md:w-auto flex items-center justify-between pb-4 g-whitbe dark:bg-gray-900">
                <div className="flex space-x-3">
                    <ActionDropdown items={menuItems}>Action</ActionDropdown>
                    <button
                        className="relative w-full m-2 flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        type="button"
                        onClick={handleOpenModal}
                    >
                        + Ajouter RDV
                    </button>
                </div>
                {isModalOpen && <AjouterRDV closeModal={handleCloseModal} />}
                <div className="relative mt-4 pr-4 w-full md:w-auto">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor"
                             viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <input type="text" id="table-search-users"
                           className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           placeholder="Search for users" onChange={handleSearchChange}/>
                </div>
            </div>
            <table className="table-auto w-full">
                <thead className="table-auto w-full text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="p-4">
                        <div className="flex items-center">
                            <input
                                id="checkbox-all-search"
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label htmlFor="checkbox-all-search" className="sr-only">
                                checkbox
                            </label>
                        </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Nom
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Heure
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Statut
                    </th>
                    <th scope="col" className="px-6 py-3"></th>
                </tr>
                </thead>
                <tbody>
                {rdvs.map((rdv, index) => (
                    <tr
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        key={index}
                    >
                        <td className="w-4 p-4">
                            <div className="flex items-center">
                                <input
                                    id={`checkbox-table-search-${index}`}
                                    type="checkbox"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search" required=""
                                />
                                <label htmlFor={`checkbox-table-search-${index}`} className="sr-only">
                                    checkbox
                                </label>
                            </div>
                        </td>
                        <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                            <MdAssignmentTurnedIn size={24} />
                            <div className="pl-3 text-left">
                                <div className="text-base font-semibold dark:text-white">{rdv?.patient?.nom}</div>
                                <div className="font-normal text-gray-500 dark:text-white">{rdv?.patient?.prenom}</div>
                            </div>
                        </th>
                        <td className="px-6 py-4">
                            <div className="flex items-center">{formatRdvDate(rdv.date)}</div>
                        </td>
                        <td className="px-6 py-4">{rdv.heureDebut}</td>
                        <td className="px-6 py-4">
                            <div className="flex items-center">
                                {getIconForStatus(rdv.statut)}
                                {rdv.statut}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                Edit user
                            </a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default RdvList;
