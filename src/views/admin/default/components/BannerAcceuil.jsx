import React, { useState, useEffect } from 'react';
import avatar from 'assets/img/avatars/avatar11.png';
import banner from 'assets/img/profile/banner.png';
import Card from 'components/card';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const Banner = ({ statistic }) => {
    const [medecin, setMedecin] = useState(null);
    const [nbrConsultations, setNbrConsultations] = useState(0); // Renamed from nbrRdv
    const token = localStorage.getItem('jwt');
    useEffect(() => {
        if (!token) {
            console.log('No token found!');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken.userType !== 'Medecin') {
                console.log('Not a Medecin type user!');
                return;
            }

            const idMedecin = decodedToken._id;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            axios.get(`http://localhost:5000/Utilisateur/${idMedecin}`, config)
                .then(response => {
                    setMedecin(response.data);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération du médecin!', error);
                });

            axios.get(`http://localhost:5000/Consultation/medecin/${idMedecin}`, config)
                .then(response => {
                    const consultations = response.data;
                    setNbrConsultations(consultations.length); // Renamed from setNbrRdv
                })
                .catch(error => {
                    console.error('Erreur en récupérant les consultations!', error);
                });
        } catch (error) {
            console.log('Error decoding token:', error);
        }
    }, []);

    return (
        <Card extra={"items-center w-full h-full p-[16px] bg-cover"}>
            {/* Background and profile */}
            <div
                className="relative flex justify-center w-full h-32 mt-1 bg-cover rounded-xl"
                style={{ backgroundImage: `url(${banner})` }}
            >

            </div>

            {/* Name and position */}
            <div className="flex flex-col items-center mt-16">
                <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                    {medecin && medecin.nom}
                </h4>
                <p className="text-base font-normal text-gray-600">Spécialité</p>
            </div>

            {/* Number of appointments */}
            <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
                <div className="flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-navy-700 dark:text-white">{nbrConsultations}</p>
                    <p className="text-sm font-normal text-gray-600">Consultations</p>
                </div>
            </div>
        </Card>
    );
};

export default Banner;