import React, { useState , useEffect } from 'react';
import BouttonAjouterP from './AddPatientAction';
import ThreeDotsDropdown from './dropDownPatient';
import {
  obtenirConsultationsMedId,obtenirPatientParId,
  obtenirDossiersMedicauxParMedecin,obtenirPatientsRdvMedecin,
} from "../../../../api";
import Card from "../../../../components/card";
import jwt_decode from "jwt-decode";


function calculateAge(birthDate) {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDifference = today.getMonth() - birthDateObj.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  return age;
}

export default function PatientListPage() {
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState([]);

  const token = localStorage.getItem('jwt');

  let medecinId;

  if(token) {
    try {
      const decodedToken = jwt_decode(token);
      console.log(decodedToken);
      medecinId = decodedToken._id;
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('jwt');
      window.location.href = '/login';
    }
  } else {
    console.log("No token found in localStorage");
    window.location.href = '/login';
  }


  useEffect(() => {
    const getPatientsAndMedicalRecords = async () => {
      if (!medecinId || !token) return;
      try {
        let [medicalRecords, patientIds] = await Promise.all([
          obtenirDossiersMedicauxParMedecin(medecinId, token),
          obtenirPatientsRdvMedecin(medecinId, token),
        ]);

        console.log("medicalRecords:", medicalRecords);
        console.log("patientIds:", patientIds);

        // Obtenir les détails de chaque patient
        let patientsList = await Promise.all(patientIds.map(id => obtenirPatientParId(id, token)));


        console.log("patientsList:", patientsList);
        if (patientsList.length > 0) {
          console.log("Example patient object:", patientsList[0]);
        }

        if (search) {
          medicalRecords = medicalRecords?.filter(record =>
              record.patient?.nom?.toLowerCase().includes(search.toLowerCase())
          );
          patientsList = patientsList?.filter(patient =>
              patient.nom?.toLowerCase().includes(search.toLowerCase())
          );
        }

        if (filters.length > 0) {
          medicalRecords = medicalRecords?.filter(record =>
              filters.includes(record.statut)
          );
          // apply filters to patients if needed
        }

        const combined = [...(medicalRecords || []).map(r => ({ ...r, type: 'medicalRecord' })), ...(patientsList || []).map(p => ({ ...p, type: 'patient' }))];

        setPatients(combined);
      } catch (error) {
        console.error('Error fetching patients and medical records:', error);
      }
    };

    getPatientsAndMedicalRecords();
  }, [search, filters, medecinId, token]);



  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  }

  return (
      <Card className="p-3 antialiased bg-gray-50 dark:bg-navy-900 sm:p-5">
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
                    <input type="text" id="simple-search"
                           className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                           placeholder="Search" required=""
                           value={search}
                           onChange={handleSearchChange}/>

                  </div>
                </form>
              </div>
              <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
                <div>
                  <button
                      type="button"
                      id="createProductModalButton"
                      data-modal-target="createProductModal"
                      data-modal-toggle="createProductModal"
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-black border rounded-lg bg-primary-700 hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      onClick={() => setShowModal(true)}
                  >
                    <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                    </svg>
                    Ajouter Patient
                  </button>
                  {showModal && <BouttonAjouterP closeModal={() => setShowModal(false)} />}
                </div>
                <div className="flex items-center w-full space-x-3 md:w-auto">
                  <button id="actionsDropdownButton" data-dropdown-toggle="actionsDropdown" className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" type="button">
                    <svg className="-ml-1 mr-1.5 w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path clip-rule="evenodd" fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                    Actions
                  </button>
                  <div id="actionsDropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="actionsDropdownButton">
                      <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Mass Edit</a>
                      </li>
                    </ul>
                    <div className="py-1">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete all</a>
                    </div>
                  </div>
                  <button id="filterDropdownButton" data-dropdown-toggle="filterDropdown" className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-4 h-4 mr-2 text-gray-400" viewbox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
                    </svg>
                    Filtre
                    <svg className="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path clip-rule="evenodd" fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </button>
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
            <div className="max-w-screen-xl overflow-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead>
                <tr>
                  <th scope="col" className="px-4 py-3 dark:text-white">NOM</th>
                  <th scope="col" className="px-4 py-3 dark:text-white">PRENOM</th>
                  <th scope="col" className="px-4 py-3 dark:text-white">AGE</th>
                  <th scope="col" className="px-4 py-3 dark:text-white">SEXE</th>
                  <th scope="col" className="px-4 py-3 dark:text-white">telephone</th>
                  <th scope="col" className="px-4 py-3 dark:text-white">Type</th>
                  <th scope="col" className="px-4 py-3 dark:text-white">Profile</th>
                </tr>
                </thead>

                <tbody>
                {patients.map(patient => (
                    <tr className="relative border-b dark:border-gray-700">
                      <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{patient.nom || ''}</th>
                      <td className="px-4 py-3">{patient.prenom || ''}</td>
                      <td className="px-4 py-3">{patient.age || ''}</td>
                      <td className="px-4 py-3">{patient.sexe || ''}</td>
                      <td className="px-4 py-3">{patient.telephone || ''}</td>
                      <td className="px-4 py-3">{patient.type}</td>
                      <td className="flex items-center justify-end px-4 py-3">
                        <ThreeDotsDropdown/>
                      </td>
                    </tr>
                ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      </Card>
                  );
                  }
