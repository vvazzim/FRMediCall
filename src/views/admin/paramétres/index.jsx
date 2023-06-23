import React, { useEffect } from 'react';
import ParamInfo from './components/Notification';
import jwtDecode from "jwt-decode";

const ProfileOverview = () => {
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        const decodedToken = jwtDecode(token);
        let userType = decodedToken.typeUtilisateur;
    });

    return (
        <div className="flex w-full flex-col gap-5">
            <div className="w-full mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
                <div className="col-span-5 lg:col-span-12 lg:mb-0 3xl:!col-span-3">
                    <ParamInfo /> {/* Inclure le composant ParamInfo */}
                </div>
            </div>
        </div>
    );
};

export default ProfileOverview;
