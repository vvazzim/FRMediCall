  import React, { useState, useEffect } from 'react';
  import jwt_decode from 'jwt-decode';
  import { MdAssignmentTurnedIn, MdCheckCircle, MdCancel, MdOutlineError } from 'react-icons/md';
  import AjouterConsultation from './PatientConsultationModal';
  import { obtenirConsultationsMedId } from '../../../../api';
  import ActionDropdown from '../../../../components/dropdown/ActionDropdown';
  import Card from "../../../../components/card";
  import {RiStethoscopeLine} from "react-icons/ri";

  const ConsultationList = () => {
    const menuItems = ['Effacé', 'Item 2', 'Item 3'];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [consultations, setConsultations] = useState([]);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState([]);

    // Get the medecin's ID from the token
    const token = localStorage.getItem('jwt');

    let medecinId;

    if(token) {
      try {
        const decodedToken = jwt_decode(token);
        console.log(decodedToken);
        medecinId = decodedToken._id;
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
      const fetchConsultations = async () => {
        if (!medecinId || !token) return;
        try {
          let response = await obtenirConsultationsMedId(medecinId, token);
          if (!response) {
            console.error('No consultations received');
            return;
          }
          if (search) {
            response = response.filter(consultation =>
                consultation.patient?.nom?.toLowerCase().includes(search.toLowerCase()));
          }
          if (filters.length > 0) {
            response = response.filter(consultation =>
                filters.includes(consultation.statut));
          }
          setConsultations(response);
        } catch (error) {
          console.error('Error fetching consultations:', error);
        }
      };
      fetchConsultations();
    }, [search, filters, medecinId, token]);


    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    const handleSearchChange = (event) => {
      setSearch(event.target.value);
    }

    const formatConsultationDate = (date) => {
      const dat = new Date(date);
      return dat.toISOString().split('T')[0];
    };


    const filterOptions = ['Confirmed', 'Canceled', 'En Attente'];

    const handleFilterChange = (selectedFilters) => {
      setFilters(selectedFilters);
    };

    return (
        <div className=" relative mt-4 overflow-x-auto shadow-md sm:rounded-lg dark:text-white">
          <div className="flex items-center justify-between w-full pb-4 md:w-auto  dark:bg-gray-900">
            <div className="flex space-x-3">
              <ActionDropdown items={menuItems}>Actions</ActionDropdown>
              <button
                  className="relative flex justify-center w-full px-4 py-2 m-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  onClick={handleOpenModal}
              >
                Ajouter une consultation
              </button>
            </div>
            <input
                className="w-full px-4 py-2 m-2 leading-normal bg-white border border-gray-300 rounded-lg appearance-none md:w-auto dark:bg-gray-800 focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Recherche par nom du patient"
                value={search}
                onChange={handleSearchChange}
            />
          </div>

          {isModalOpen && <AjouterConsultation closeModal={handleCloseModal} />}

          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead>
            <tr>
              <th scope="col" className="px-4 py-3 text-navy-600 dark:text-white">Patient</th>
              <th scope="col" className="px-4 py-3 text-navy-600 dark:text-white">Date de consultation</th>
              <th scope="col" className="px-4 py-3 text-navy-600 dark:text-white">Diagnostic</th>
            </tr>
            </thead>
            <tbody>
            {consultations.map((consultation) => (
                <tr className="relative border-b dark:border-gray-700">
                  <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <div className="flex items-center">
                      <RiStethoscopeLine size={35} className="mr-2 text-blue-500" />
                      {`${consultation.patient?.nom || ''} ${consultation.patient?.prenom || ''}`}
                    </div>
                  </th>
                  <td className="px-4 py-3 text-navy-800 dark:text-white">{formatConsultationDate(consultation.date) || ''}</td>
                  <td className="px-4 py-3 text-navy-700 dark:text-white">{consultation.diagnostic || ''}</td>
                  <td className="flex items-center justify-end px-4 py-3">

                  </td>
                </tr>
            ))}
            </tbody>
          </table>

        </div>
    );}

  export default ConsultationList;
