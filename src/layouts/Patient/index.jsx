import React, { Suspense, useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import PatientNavbar from "../../components/navbar/index";
import Sidebar from "../../components/sidebar/index";
import patientRoutes from "../../routes";

const PatientLayout = () => {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        window.addEventListener("resize", () =>
            window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
        );
    }, []);

    const getRoutes = (routes) => {
        return routes.map((prop, key) => {
            if (prop.layout === "/patient") {
                return (
                    <Route path={`/${prop.path}`} element={<Suspense fallback={<div>Loading...</div>}><prop.component /></Suspense>} key={key} />
                );
            } else {
                return null;
            }
        });
    };

    return (
        <div className="flex h-full w-full">
            <Sidebar open={open} onClose={() => setOpen(false)} />
            {/* Navbar & Main Content */}
            <div className="h-full w-full">
                {/* Main Content */}
                <main
                    className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
                >
                    {/* Routes */}
                    <div className="h-full">
                        <PatientNavbar onOpenSidenav={() => setOpen(true)} />
                        <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
                            <Routes>
                                {getRoutes(patientRoutes)}
                            </Routes>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PatientLayout;
