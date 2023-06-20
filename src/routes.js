import React from "react";

// Admin Imports
import DashboardPage from "views/admin/default";
import PatientListPage from "views/admin/patient/components/PatientList";
import Paramétres from "views/admin/paramétres";
import Agenda from "views/admin/agenda";
import RdvPage from "views/admin/rendez-vous/index";
import RdvPageP from "views/Patient/RDV/index";
import ConsultationPage from "views/admin/consultation";
import RTLDefault from "views/rtl/default/index";

// Auth Imports
import SignIn from "views/auth/SignIn";
import SIform from "views/auth/SignUpForm";
import ForgetPwd from "views/auth/ForgetP";

// Patient Imports

// Icon Imports
import {
  MdHome,
  MdPeopleAlt,
  MdLock,
  MdSettings,
  MdAssignmentTurnedIn,
} from "react-icons/md";

import {
  RiStethoscopeLine
} from "react-icons/ri";

import {
  IoCalendarNumber
} from "react-icons/io5";
import PatientRdvPage from "./views/Patient/RDV/index";
import MedecinPage from "./views/Patient/medecins/index";

const adminRoutes = [
  {
    name: "Acceuil",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: DashboardPage,
  },
  {
    name: "Patient",
    layout: "/admin",
    path: "patient",
    icon: <MdPeopleAlt className="h-6 w-6" />,
    component: PatientListPage,
  },
  {
    name: "Agenda",
    layout: "/admin",
    path: "agenda",
    icon: <IoCalendarNumber className="h-6 w-6" />,
    component: Agenda,
  },
  {
    name: "Consultation",
    layout: "/admin",
    path: "consultation",
    icon: <RiStethoscopeLine className="h-6 w-6" />,
    component: ConsultationPage,
  },
  {
    name: "Rendez Vous",
    layout: "/admin",
    path: "rendez-vous",
    icon: <MdAssignmentTurnedIn className="h-6 w-6" />,
    component: RdvPage,
  },
  {
    name: "Paramétres",
    layout: "/admin",
    path: "medecins",
    icon: <MdSettings className="h-6 w-6" />,
    component: Paramétres,
  },
  {
    name: "RTL Admin",
    layout: "/admin",
    path: "rtl",
    icon: <MdHome className="h-6 w-6" />,
    component: RTLDefault,
  },
];

const patientRoutes = [
  {
    name: "Acceuil",
    layout: "/patient",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: DashboardPage,
  },
  {
    name: "Consultation",
    layout: "/patient",
    path: "consultation",
    icon: <RiStethoscopeLine className="h-6 w-6" />,
    component: ConsultationPage,
  },
  {
    name: "Medecins",
    layout: "/patient",
    path: "medecins", // <-- changed this from "" to "medecins"
    icon: <RiStethoscopeLine className="h-6 w-6" />,
    component: MedecinPage,
  },
  {
    name: "Rendez-Vous",
    layout: "/patient",
    path: "RDV",
    icon: <RiStethoscopeLine className="h-6 w-6" />,
    component: RdvPageP,
  },
];


const authRoutes = [
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    component: SignIn,
  },
  {
    name: "Sign Up",
    path: "sign-up",
    layout: "/auth",
    component: SIform,
  },
  {
    name: "Forget Password",
    path: "forget-password",
    layout: "/auth",
    component: ForgetPwd,
  },
];

export default [...adminRoutes, ...patientRoutes, ...authRoutes];

export { adminRoutes, patientRoutes, authRoutes };
