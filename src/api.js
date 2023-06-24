// src/api.js
import axios from 'axios';
import jwtDecode from "jwt-decode";

// Configuring Axios Instances for Different Endpoints
const API_BASE_URL = 'http://localhost:5000';
const apiAuth = axios.create({ baseURL: API_BASE_URL });
const apiUtilisateur = axios.create({ baseURL: `${API_BASE_URL}/Utilisateur` });
export const apiRdv = axios.create({ baseURL: `${API_BASE_URL}/Rdv` });
const apiAgenda = axios.create({ baseURL: `${API_BASE_URL}/agendas` });
const apiCabinetMedical = axios.create({ baseURL: `${API_BASE_URL}/cabinetMedical` });
const apiConsultation = axios.create({ baseURL: `${API_BASE_URL}/consultation` });
const apiUser = axios.create({ baseURL: `${API_BASE_URL}/Utilisateur` });
const apiDossierMed = axios.create({ baseURL: `${API_BASE_URL}/DossierMedical` });

// Error Handler Function
const handleApiError = (error, errorMessage) => {
  // ... (no changes here)
};

// Auth Functions
export const login = async (email, password) => {
  try {
    const response = await apiAuth.post('/login', { email, password });
    return response;
  } catch (error) {
    console.error('Error during login request:', error);
    return Promise.reject(error);
  }
};

export const register = async (userData) => {
  try {
    const response = await apiAuth.post('/register', userData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error during registration');
  }
};

// Generic Function to Get Users by Type
const obtenirUtilisateurs = async (typeUtilisateur, token) => {
  try {
    const response = await apiUtilisateur.get('/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      params: { typeUtilisateur }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, `Error retrieving ${typeUtilisateur}`);
  }
};

// Generic Function to Add User
export const ajouterUtilisateur = async (typeUtilisateur, data) => {
  try {
    const response = await apiUtilisateur.post('/', { ...data, typeUtilisateur });
    return response.data;
  } catch (error) {
    handleApiError(error, `Error adding ${typeUtilisateur}`);
  }
};

// Now, you can use these functions to get and add patients, doctors, and assistants
export const obtenirPatient = async (token) => obtenirUtilisateurs('Patient', token);
export const obtenirMedecins = async (token) => obtenirUtilisateurs('Medecin', token);
export const ajouterMedecin = async (data) => ajouterUtilisateur('Medecin', data);
export const ajouterAssistant = async (data) => ajouterUtilisateur('Assistant', data);

export const ajouterPatient = async (newUser, token) => {
  try {
    const response = await apiUtilisateur.post('/', newUser, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Erreur lors de l'ajout de l'utilisateur");
  }
};


// Other API calls
export const obtenirConsultationsPatientConnecte = async (id, token) => {
  try {
    const response = await apiConsultation.get(`/patient/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des consultations:', error);
    return null;
  }
};



export const obtenirDossiersMedicauxParMedecin = async (medecinId, token) => {
  try {
    const response = await apiDossierMed.get(`/auteur/${medecinId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (response.status !== 200 || !response.data) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Assuming each medical record has a 'patient' field that contains patient details
    const medicalRecords = response.data.map(record => record.patient ? record.patient : record.informationsPatient);

    return medicalRecords;
  } catch (error) {
    console.error('Failed to fetch medical records:', error);
    return []; // Return empty array as a fallback
  }
};





export const obtenirRdv = async (id) => {
  try {
    const response = await apiRdv.get(`/medecin/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Erreur lors de la récupération des RDVs');
    return [];
  }
};

export const obtenirConsultationsMedId = async (medecinId, token) => {
  try {
    const response = await apiConsultation.get(`/medecin/${medecinId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const consultations = response.data;
    return consultations;
  } catch (error) {
    console.error('Failed to fetch consultations:', error);
  }
};

export const ajouterRdv = async (rdvData) => {
  try {
    const response = await apiRdv.post('/', rdvData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error adding appointment');
  }
};

export const getAgenda = async (userId) => {
  try {
    const response = await apiAgenda.get(`/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error getting agenda');
  }
};

export const ajouterAgenda = async (agendaData) => {
  try {
    const response = await apiAgenda.post('/', agendaData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error adding agenda');
  }
};

export const obtenirCabinetsMedicaux = async () => {
  try {
    const response = await apiCabinetMedical.get('/');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error retrieving medical cabinets');
  }
};

export const ajouterCabinetMedical = async (cabinetData) => {
  try {
    const response = await apiCabinetMedical.post('/', cabinetData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error adding medical cabinet');
  }
};

export const obtenirConsultation = async () => {
  try {
    const response = await apiConsultation.get('/').populate('patient medecin');
    console.log('consultations:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error retrieving consultations');
  }
};

export const modifierUtilisateur = async (utilisateurId, newData, token) => {
  try {
    const response = await apiUtilisateur.put(`/${utilisateurId}`, newData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Erreur lors de la modification de l\'utilisateur');
  }
};


export const obtenirUtilisateur = async (token) => {
  try {
    const response = await apiUtilisateur.get('/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Erreur lors de la récupération des détails de l\'utilisateur');
  }
};

export const ajouterDossierMedical = async (dossierMedicalData, token) => {
  try {
    const response = await apiDossierMed.post('', dossierMedicalData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error adding medical record');
  }
};


export const obtenirPatientsRdvMedecin = async (medecinId, token) => {
  try {
    const response = await apiRdv.get(`/medecin/${medecinId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Assuming each appointment has a 'patient' field that contains patient details
    const patients = response.data.map(rdv => rdv.patient);

    return patients;
  } catch (error) {
    console.error('Failed to fetch patients:', error);
  }
};



export const obtenirPatientsParMedecin = async (medecinId, token) => {
  try {
    const response = await apiUtilisateur.get('/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      params: { typeUtilisateur: 'Patient' }
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Filtrage des patients par medecinId
    const patients = response.data.filter(patient => patient.medecinId === medecinId);

    return patients;
  } catch (error) {
    console.error('Failed to fetch patients:', error);
  }
};



export const obtenirAgenda = async (userId) => {
  try {
    const response = await apiAgenda.get(`/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Erreur lors de la récupération de l\'agenda');
  }
};

// export const ajouterAgenda = async (agendaData) => {
//   try {
//     const response = await apiAgenda.post('/', agendaData);
//     return response.data;
//   } catch (error) {
//     handleApiError(error, 'Erreur lors de l\'ajout de l\'agenda');
//   }
// };



export const obtenirPatientParId = async (patientId, token) => {
  try {
    const response = await apiUtilisateur.get(`/${patientId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(`Failed to fetch patient with ID ${patientId}:`, error);
  }
};

const getToken = () => {
  const token = localStorage.getItem('jwt');
  const decodedToken = jwtDecode(token);
  const medecinId = decodedToken._id;

  if (!medecinId) {
    console.error("Impossible de récupérer l'ID du médecin");
    return null;
  }

  return { token, medecinId };
}



