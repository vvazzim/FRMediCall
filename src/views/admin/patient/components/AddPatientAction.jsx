import React,{useState} from 'react';
import { ajouterPatient, ajouterDossierMedical } from '../../../../api';


export default function BouttonAjouterP({ closeModal }) {
  const [hasMedicalAccount, setHasMedicalAccount] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();

    const newUser = {
      nom: event.target.lastName.value,
      prenom: event.target.firstName.value,
      email: hasMedicalAccount ? event.target.email.value : null,
      motDePasse: hasMedicalAccount ? event.target.password.value : null,
      telephone: event.target.phone.value,
      adresse: event.target.address.value,
      typeUtilisateur: 'Patient',
      dateDeNaissance: event.target.dateOfBirth.value,
      sexe: event.target.sex.value,
      NSS: event.target.nss.value,
    };

    if (hasMedicalAccount) {
      try {
        await ajouterPatient(newUser);
        console.log("Utilisateur ajouté avec succès");
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur", error);
      }
    } else {
      delete newUser.motDePasse;
      try {
        await ajouterDossierMedical(newUser);
        console.log("Dossier médical ajouté avec succès");
      } catch (error) {
        console.error("Erreur lors de l'ajout du dossier médical", error);
      }
    }
  };

  return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm bg-opacity-50">
        <div className="bg-white dark:bg-navy-700 rounded-lg shadow-lg w-full max-w-md">
          <div className="p-4" style={{ maxHeight: "95vh", overflowY: "auto" }}>
            <div className="flex justify-between items-center pb-4 mb-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ajouter Utilisateur</h3>
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
              <div className="grid gap-4 mb-4 sm:grid-cols-2">
                <div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Compte médical</label>
                    <div className="flex items-center">
                      <input type="radio" name="medicalAccount" value="withAccount" id="withAccount" required="" className="mr-2" onChange={() => setHasMedicalAccount(true)} />
                      <label htmlFor="withAccount" className="mr-4">Avec compte</label>
                      <input type="radio" name="medicalAccount" value="withoutAccount" id="withoutAccount" required="" className="mr-2" onChange={() => setHasMedicalAccount(false)} />
                      <label htmlFor="withoutAccount">Sans compte</label>
                    </div>
                  </div>

                  {hasMedicalAccount && (
                      <>
                        <div>
                          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                          <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 mb-4 w-full p-2" required="" />
                        </div>

                        <div>
                          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mot de passe</label>
                          <input type="password" name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 mb-4 w-full p-2" required="" />
                        </div>
                      </>
                  )}
                  <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom</label>
                  <input type="text" name="lastName" id="lastName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Saisissez le nom" required="" />
                </div>
                <div>
                  <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Prénom</label>
                  <input type="text" name="firstName" id="firstName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Saisissez le prénom" required="" />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Téléphone</label>
                <input type="text" name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Saisissez le numéro de téléphone" required="" />
              </div>

              <div>
                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Adresse</label>
                <input type="text" name="address" id="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Saisissez l'adresse" required="" />
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date
                  de naissance</label>
                <input type="date" name="dateOfBirth" id="dateOfBirth"
                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                       required=""/>
              </div>

              <div>
                <label htmlFor="sex" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sexe</label>
                <div className="flex items-center">
                  <input type="radio" name="sex" value="male" id="sexMale" required="" className="mr-2"/>
                  <label htmlFor="sexMale" className="mr-4">Masculin</label>
                  <input type="radio" name="sex" value="female" id="sexFemale" required="" className="mr-2"/>
                  <label htmlFor="sexFemale">Féminin</label>
                </div>
              </div>



              <div>
                <label htmlFor="nss" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Numéro de
                  sécurité sociale</label>
                <input type="text" name="nss" id="nss"
                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                       placeholder="Saisissez le numéro de sécurité sociale" required=""/>
              </div>

              <div className="mt-4">
                <button type="submit" className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Ajouter
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
  )
}
