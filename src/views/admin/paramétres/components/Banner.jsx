import React, { useState, useEffect } from 'react';
import avatar from 'assets/img/avatars/avatar11.png';
import banner from 'assets/img/profile/banner.png';
import Card from 'components/card';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const Banner = () => {
    const [medecin, setMedecin] = useState(null);
    const [nbrRdv, setNbrRdv] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.log('No token found!');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const idMedecin = decodedToken.idMedecin;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            axios.get(`http://localhost:5000/Utilisateur/${idMedecin}`, config)
                .then(response => {
                    setMedecin(response.data);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération du médecin!', error);
                });

            axios.get(`http://localhost:5000/rdv/${idMedecin}`, config)
                .then(response => {
                    const rendezvous = response.data;
                    setNbrRdv(rendezvous.length);
                })
                .catch(error => {
                    console.error('Erreur en récupérant les rendez-vous!', error);
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
                <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
                    <img className="w-full h-full rounded-full" src={avatar} alt="" />
                </div>
            </div>

            {/* Name and position */}
            <div className="flex flex-col items-center mt-16">
                <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                    {medecin && medecin.nom }
                </h4>
                <p className="text-base font-normal text-gray-600">Médecin</p>
            </div>

            {/* Number of appointments */}
            <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
                <div className="flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-navy-700 dark:text-white">{nbrRdv}</p>
                    <p className="text-sm font-normal text-gray-600">NBR. de RDV</p>
                </div>
            </div>
        </Card>
    );
};

export default Banner;
