import React, { useState , useEffect } from 'react';
import BouttonAjouterP from './AddPatientAction';
import ThreeDotsDropdown from './dropDownPatient';
import {
  obtenirConsultationsMedId,
  obtenirDossiersMedicauxParMedecin,
  obtenirPatientsParMedecin,
  obtenirPatientsRdvMedecin
} from "../../../../api";

import Card from "../../../../components/card";
import jwt_decode from "jwt-decode";

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
        let [medicalRecords, patientsList] = await Promise.all([
          obtenirDossiersMedicauxParMedecin(medecinId, token),
          obtenirPatientsRdvMedecin(medecinId, token),
        ]);

        if (search) {
          medicalRecords = medicalRecords.filter(record =>
              record.patient?.nom?.toLowerCase().includes(search.toLowerCase())
          );
          patientsList = patientsList.filter(patient =>
              patient.nom?.toLowerCase().includes(search.toLowerCase())
          );
        }

        if (filters.length > 0) {
          medicalRecords = medicalRecords.filter(record =>
              filters.includes(record.statut)
          );
          // apply filters to patients if needed
        }

        setPatients([...medicalRecords, ...patientsList]);
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
      <Card className="bg-gray-50 dark:bg-navy-900 p-3 sm:p-5 antialiased">
        <div className="mx-auto max-w-screen-xl px-1 lg:px-19">
          <div className="bg-white dark:bg-navy-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
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
                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                         placeholder="Search" required=""
                         value={search}
                         onChange={handleSearchChange}/>

                </div>
              </form>
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              <div>
                <button
                  type="button"
                  id="createProductModalButton"
                  data-modal-target="createProductModal"
                  data-modal-toggle="createProductModal"
                  className="flex items-center justify-center text-black bg-primary-700 hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg border text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  onClick={() => setShowModal(true)}
                >
                  <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                  </svg>
                  Ajouter Patient
                </button>
                {showModal && <BouttonAjouterP closeModal={() => setShowModal(false)} />}
              </div>
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <button id="actionsDropdownButton" data-dropdown-toggle="actionsDropdown" className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" type="button">
                  <svg className="-ml-1 mr-1.5 w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clip-rule="evenodd" fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                  Actions
                </button>
                <div id="actionsDropdown" className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                  <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="actionsDropdownButton">
                    <li>
                      <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Mass Edit</a>
                    </li>
                  </ul>
                  <div className="py-1">
                    <a href="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete all</a>
                  </div>
                </div>
                <button id="filterDropdownButton" data-dropdown-toggle="filterDropdown" className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-4 w-4 mr-2 text-gray-400" viewbox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
                  </svg>
                  Filter
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
            <div className="overflow-auto max-w-screen-xl">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead>
                <tr>
                  <th scope="col" className="px-4 py-3 text-white">NOM</th>
                  <th scope="col" className="px-4 py-3">PRENOM</th>
                  <th scope="col" className="px-4 py-3">AGE</th>
                  <th scope="col" className="px-4 py-3">SEXE</th>
                  <th scope="col" className="px-4 py-3">telephone</th>
                  <th scope="col" className="px-4 py-3">Type</th>
                  <th scope="col" className="px-4 py-3">Profile</th>
                </tr>
                </thead>

                <tbody>
                {patients.map(patient => (
                    <tr className="border-b dark:border-gray-700 relative">
                      <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{patient.nom || ''}</th>
                      <td className="px-4 py-3">{patient.prenom || ''}</td>
                      <td className="px-4 py-3">{patient.age || ''}</td>
                      <td className="px-4 py-3">{patient.sexe || ''}</td>
                      <td className="px-4 py-3">{patient.telephone || ''}</td>
                      <td className="px-4 py-3">{patient.type}</td>
                      <td className="px-4 py-3 flex items-center justify-end">
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