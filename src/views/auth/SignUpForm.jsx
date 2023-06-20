import React, { useState, useEffect } from 'react';
import InputField from 'components/fields/InputField';
import {
  ajouterAssistant,
  ajouterMedecin,
  ajouterPatient,
  obtenirCabinetsMedicaux,
  obtenirMedecins,
} from '../../api';

export default function InscriptionForm() {
  // Initialize state variables
  const [typeUtilisateur, setTypeUtilisateur] = useState('');
  const [cabinetsMedicaux, setCabinetsMedicaux] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [cabinetMedical, setCabinetMedical] = useState('');
  const [specialite, setSpecialite] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [sexe, setSexe] = useState(null);
  const [NSS, setNSS] = useState('');

  // Fetch cabinets when the component is mounted
  useEffect(() => {
    const fetchCabinets = async () => {
      try {
        const cabinets = await obtenirCabinetsMedicaux();
        setCabinetsMedicaux(cabinets);
      } catch (error) {
        console.error('Erreur lors de la récupération des cabinets:', error);
      }
    };

    fetchCabinets();
  }, []);

  // Fetch doctors when the selected cabinet changes
  useEffect(() => {
    if (cabinetMedical) {
      const fetchMedecins = async () => {
        try {
          const medecins = await obtenirMedecins(cabinetMedical);
          setMedecins(medecins);
        } catch (error) {
          console.error('Erreur lors de la récupération des medecins:', error);
        }
      };

      fetchMedecins();
    }
  }, [cabinetMedical]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get values from the form
    const nom = e.target.elements.nom?.value;
    const prenom = e.target.elements.prenom?.value;
    const email = e.target.elements.email?.value;
    const motDePasse = e.target.elements.motDePasse?.value;
    const telephone = e.target.elements.telephone?.value;
    const adresse = e.target.elements.adresse?.value;

    // Additional properties for assistant
    const medecin = e.target.elements.medecins?.value;
    let cabinet = e.target.elements.cabinetMedical?.value;
    // Create the user object with the common properties
    let userObj = {
      nom,
      prenom,
      email,
      motDePasse,
      telephone,
      adresse,
    };

    // Assign the properties based on the type of the user
    if (typeUtilisateur === 'medecin') {
      userObj = { ...userObj, specialite, cabinets: cabinetMedical };
    } else if (typeUtilisateur === 'patient') {
      userObj = { ...userObj, dateNaissance, sexe, NSS };
    } else if (typeUtilisateur === 'Assistant') {
      userObj = { ...userObj, cabinet, medecin };
    }

    try {
      let response;

      // Call the appropriate API based on the user type
      switch (typeUtilisateur) {
        case 'assistant':
          response = await ajouterAssistant(userObj);
          break;
        case 'medecin':
          response = await ajouterMedecin(userObj);
          break;
        case 'patient':
          response = await ajouterPatient(userObj);
          break;
        default:
          console.error('Type d\'utilisateur inconnu: ', typeUtilisateur);
          return;
      }

      console.log('User data sent: ', userObj);
    } catch (error) {
      console.error('Error sending data: ', error);
    }
  };


  // Render form
  return (
      <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
        <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
          <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
            Inscription
          </h4>
          <p className="mb-9 ml-1 text-base text-gray-600">
            Fill in your details to register!
          </p>
          {/* Form starts here */}
          <form onSubmit={handleSubmit}>
            <InputField variant="auth" extra="mb-3" label="Nom*" placeholder="Votre nom" id="nom" type="text" />
            <InputField variant="auth" extra="mb-3" label="Prenom*" placeholder="Votre prenom" id="prenom" type="text" />
            <InputField variant="auth" extra="mb-3" label="Email*" placeholder="mail@example.com" id="email" type="email" />
            <InputField variant="auth" extra="mb-3" label="Password*" placeholder="Min. 8 characters" id="motDePasse" type="password" />
            <InputField variant="auth" extra="mb-3" label="Telephone*" placeholder="Votre telephone" id="telephone" type="tel" />
            <InputField variant="auth" extra="mb-3" label="Adresse*" placeholder="Votre adresse" id="adresse" type="text" />
            <label className="mb-3 dark:text-white" htmlFor="typeUtilisateur">Type d'utilisateur*</label>
            <select id="typeUtilisateur" onChange={(e) => setTypeUtilisateur(e.target.value)} className="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option value="assistant">assistant</option>
              <option value="patient">Patient</option>
              <option value="medecin">Médecin</option>
            </select>
            {typeUtilisateur === 'assistant' && (
                <>
                  <label className="mb-3" htmlFor="cabinetMedical">CabinetMedical*</label>
                  <select id="cabinetMedical" onChange={(e) => setCabinetMedical(e.target.value)} className="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
                    {cabinetsMedicaux.map((cabinet) => (
                        <option key={cabinet._id} value={cabinet._id}>{cabinet.nom}</option>
                    ))}
                  </select>
                  <label className="mb-3" htmlFor="medecin">Medecins</label>
                  <select id="medecin" className="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
                    {medecins.map((medecin) => (
                        <option key={medecin._id} value={medecin._id}>{medecin.nom}</option>
                    ))}
                  </select>
                </>
            )}
            {typeUtilisateur === 'medecin' && (
                <InputField variant="auth" extra="mb-3" label="Spécialité*" placeholder="Votre spécialité" id="specialite" type="text" onChange={(e) => setSpecialite(e.target.value)} />
            )}
            {typeUtilisateur === 'patient' && (
                <>
                  <InputField variant="auth" extra="mb-3" label="Date de naissance*" placeholder="JJ/MM/AAAA" id="dateNaissance" type="date" onChange={(e) => setDateNaissance(e.target.value)} />
                  <InputField variant="auth" extra="mb-3" label="Numéro de sécurité sociale*" placeholder="Votre numéro de sécurité sociale" id="NSS" type="text" onChange={(e) => setNSS(e.target.value)} />
                </>
            )}
            <button type="submit" className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
              S'inscrire
            </button>
          </form>
          <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Déjà enregistré?
          </span>
            <a href=" " className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white">
              Se connecter
            </a>
          </div>
        </div>
      </div>
  );
}
