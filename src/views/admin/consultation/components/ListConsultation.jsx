  import React, { useState, useEffect } from 'react';
  import jwt_decode from 'jwt-decode';
  import { MdAssignmentTurnedIn, MdCheckCircle, MdCancel, MdOutlineError } from 'react-icons/md';
  import AjouterConsultation from './PatientConsultationModal';
  import { obtenirConsultationsMedId } from '../../../../api';
  import ActionDropdown from '../../../../components/dropdown/ActionDropdown';

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
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6 dark:text-white">
          <div className="w-full md:w-auto flex items-center justify-between pb-4 g-whitbe dark:bg-gray-900">
            <div className="flex space-x-3">
              <ActionDropdown items={menuItems}>Action</ActionDropdown>
              <button
                  className="relative w-full m-2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  onClick={handleOpenModal}
              >
                Ajouter une consultation
              </button>
            </div>
            <input
                className="w-full md:w-auto bg-white dark:bg-gray-800 focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 appearance-none leading-normal m-2"
                type="text"
                placeholder="Recherche par nom du patient"
                value={search}
                onChange={handleSearchChange}
            />
          </div>

          {isModalOpen && <AjouterConsultation closeModal={handleCloseModal} />}

          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead>
            <tr>
              <th className="align-middle">Patient</th>
              <th className="align-middle">Date de consultation</th>
              <th className="align-middle">Diagnostic</th>
            </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
            {consultations.map((consultation) => (
                <tr key={consultation._id} className="h-12">
                  <td className="align-middle">
                    <div className="flex items-center ml-3">
                      <button className="text-blue-500 hover:text-blue-700 mr-2">
                        <MdAssignmentTurnedIn size={25} />
                      </button>
                      {consultation.patient?.nom}
                    </div>
                  </td>
                  <td className="align-middle">{formatConsultationDate(consultation.date)}</td>
                  <td className="align-middle">{consultation.diagnostic}</td>
                </tr>
            ))}
            </tbody>





          </table>
        </div>
    );
  };


  export default ConsultationList;
