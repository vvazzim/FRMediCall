import TaskCard from "views/admin/default/components/TaskCard";
import BannerAcceuil from "./components/BannerAcceuil";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import MiniCalendar from "../../../components/calendar/MiniCalendar";
const Dashboard = () => {
  const [nbrConsultations, setNbrConsultations] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    console.log(token);
    if (!token) {
      console.log('No token found!');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const idMedecin = decodedToken._id;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      axios.get(`http://localhost:5000/Consultation/medecin/${idMedecin}`, config)
          .then(response => {
            const consultations = response.data;
            setNbrConsultations(consultations.length);
          })
          .catch(error => {
            console.error('Erreur en récupérant les consultations!', error);
          });
    } catch (error) {
      console.log('Error decoding token:', error);
    }
  }, []);

  return (
      <div>
        <div className="grid grid-cols-1 gap-5 mt-5 xl:grid-cols-2">
          <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
            <BannerAcceuil statistic={{ value: nbrConsultations, name: "NBR. de consultations" }} />

            <BannerAcceuil />
          </div>
          <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
            <BannerAcceuil />
            <TaskCard />
          </div>
        </div>
        <div className="col-span-4 lg:!mb-0">
            <MiniCalendar/>
        </div>
      </div>
  );
};

export default Dashboard;