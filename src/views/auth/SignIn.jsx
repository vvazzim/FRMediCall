import React, { useState } from 'react';
import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import Checkbox from "components/checkbox";
import { Link, useNavigate } from 'react-router-dom';
import {login} from "../../api";
import jwtDecode from 'jwt-decode';

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      localStorage.clear();
      if (!email || !password) {
        console.error('Email and password are required');
        return;
      }

      const response = await login(email, password);

      if (response.status >= 400) {
        console.error('Server error:', response);
        return;
      }

      if (response && response.data && response.data.token) {
        localStorage.removeItem('jwt');
        localStorage.setItem('jwt', response.data.token);

        const decoded = jwtDecode(response.data.token);

        const userType = decoded.userType.toLowerCase();

        if (userType === "admin") {
          navigate("/admin");
        } else if (userType === "patient") {
          navigate("/patient");
        } else if (userType === "medecin") {
          navigate("/admin");
        } else {
          console.log('Unrecognized userType');
        }
      } else {
        console.log('No valid token in response');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };





  return (
      <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
        {/* Sign in section */}
        <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
          <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
            Se connecter
          </h4>
          <p className="mb-9 ml-1 text-base text-gray-600">
            Saisissez votre adresse email et votre mot de passe pour vous inscrire
          </p>
          <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800">
            <div className="rounded-full text-xl">
              <FcGoogle />
            </div>
            <h5 className="text-sm font-medium text-navy-700 dark:text-white">
              INSCRIVEZ-VOUS AVEC GOOGLE
            </h5>
          </div>
          <div className="mb-6 flex items-center  gap-3">
            <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
            <p className="text-base text-gray-600 dark:text-white"> or </p>
            <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          </div>
          {/* Email */}
          <InputField
              variant="auth"
              extra="mb-3"
              label="Email*"
              placeholder="mail@simmmple.com"
              id="email"
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
          />

          {/* Password */}
          <InputField
              variant="auth"
              extra="mb-3"
              label="Mot de passe*"
              placeholder="Min. 8 caractères"
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
          />
          {/* Checkbox */}
          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center">
              <Checkbox />
              <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                Rester connecté
              </p>
            </div>
            <Link
                to="/forgot"
                className="text-sm font-medium text-navy-700 underline dark:text-white"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          {/* Button */}
          <button
              className="mb-5 mt-2 flex h-12 w-full items-center justify-center text-white font-medium bg-navy-700 rounded-xl dark:bg-navy-800"
              onClick={handleLogin}
          >
            S'identifier
          </button>
          {/* Already have an account? */}
          <div className="flex items-center justify-center">
            <p className="mr-1 text-sm font-medium text-navy-700 dark:text-white">
              Vous n'avez pas de compte ?
            </p>
            <Link
                to="/register"
                className="text-sm font-medium text-navy-700 underline dark:text-white"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
  );
}
