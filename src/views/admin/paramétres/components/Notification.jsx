import React, { useState, useEffect } from 'react';
import InputField from 'components/fields/InputField';
import {ajouterUtilisateur, modifierUtilisateur, obtenirUtilisateur} from '../../../../api';
import jwtDecode from "jwt-decode";

export default function ParamInfo() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedUserData = {
        nom,
        prenom,
        email,
      };

      const token = localStorage.getItem('jwt');
      const userId = jwtDecode(token)._id;

      if (token) {
        await modifierUtilisateur(userId,updatedUserData, token);
        console.log('User data updated:', updatedUserData);

        // Appel de la méthode pour récupérer les informations de l'utilisateur
        const utilisateur = await obtenirUtilisateur(token);
        console.log('Utilisateur:', utilisateur);

        // Mettre à jour les valeurs des champs avec les informations de l'utilisateur
        setNom(utilisateur.nom);
        setPrenom(utilisateur.prenom);
        setEmail(utilisateur.email);
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
      <div>
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Compte Utilisateur Connecté
        </h4>
        <form onSubmit={handleSubmit}>
          <InputField
              variant="auth"
              extra="mb-3"
              label="Nom*"
              placeholder="Votre nom"
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
          />
          <InputField
              variant="auth"
              extra="mb-3"
              label="Prénom*"
              placeholder="Votre prénom"
              id="prenom"
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
          />
          <InputField
              variant="auth"
              extra="mb-3"
              label="Email*"
              placeholder="mail@example.com"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />
          <button
              type="submit"
              className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Mettre à jour
          </button>
        </form>
      </div>
  );
}
