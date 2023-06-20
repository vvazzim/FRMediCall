import React from 'react';
import { Link } from 'react-router-dom';

const WelcomeScreen = () => {
    return (
        <div>
            <h1>Bienvenue dans notre application</h1>
            <Link to="/login">
                <button>Se connecter</button>
            </Link>
            <Link to="/signup">
                <button>Créer un compte</button>
            </Link>
        </div>
    );
};

export default WelcomeScreen;
