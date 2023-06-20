// src/api.js
import axios from 'axios';

// Configuring Axios Instances for Different Endpoints
const apiAuth = axios.create({ baseURL: 'http://localhost:5000' });
const apiUtilisateur = axios.create({ baseURL: 'http://localhost:5000/Utilisateur' });
export const apiRdv = axios.create({ baseURL: 'http://localhost:5000/Rdv' });
const apiAgenda = axios.create({ baseURL: 'http://localhost:5000/agendas' });
const apiCabinetMedical = axios.create({ baseURL: 'http://localhost:5000/cabinetMedical' });
const apiConsultation = axios.create({ baseURL: 'http://localhost:5000/consultation' });
const apiUser = axios.create({ baseURL: 'http://localhost:5000/user' });

// Error Handler Function
const handleApiError = (error, errorMessage) => {
  // ... (no changes here)
};

// Auth Functions
export const login = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:5000/login', {
      email,
      password,
    });
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

// Patient Functions
export const obtenirPatient = async () => {
  try {
    const response = await apiUtilisateur.get('/', { params: { typeUtilisateur: 'Patient' } });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error retrieving patients');
  }
};

export const ajouterPatient = async (patientData) => {
  try {
    patientData.typeUtilisateur = 'Patient';
    const response = await apiUtilisateur.post('/', patientData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error adding Patient');
  }
};


export const obtenirConsultationsPatientConnecte = async (token) => {
  try {
    const response = await apiConsultation.get('/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data; // Replace with the actual data structure your API returns
  } catch (error) {
    handleApiError(error, 'Erreur lors de la récupération des consultations');
  }
};



// Assistant Functions
export const ajouterAssistant = async (assistantData) => {
  try {
    const response = await apiUtilisateur.post('/', assistantData, { params: { typeUtilisateur: 'Assistant' }});
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error adding assistant');
  }
};



// Doctor Functions
export const obtenirMedecins = async () => {
  try {
    const response = await apiUtilisateur.get('/', { params: { typeUtilisateur: 'Medecin' } });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error retrieving doctors');
  }
};

export const ajouterMedecin = async (medecinData) => {
  try {
    medecinData.typeUtilisateur = 'Medecin';
    const response = await apiUtilisateur.post('/', medecinData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error adding doctor');
  }
};

// Appointment Functions
export const obtenirRdv = async () => {
  try {
    const response = await apiRdv.get('/');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error retrieving appointments');
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

// Agenda Functions
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

// Medical Cabinet Functions
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




export const obtenirUtilisateur = async (token) => {
  try {
    const response = await apiUser.get('/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Erreur lors de la récupération des détails de l\'utilisateur');
  }
};



