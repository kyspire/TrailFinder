import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login.jsx';
import SignUp from '../components/SignUp.jsx';

function LoginPage() {
    const [authMode, setAuthMode] = useState("Log In");
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const toggleAuthMode = () => {
        setAuthMode(authMode === "Log In" ? "Sign Up" : "Log In");
        setErrorMessage('');
        setSuccessMessage('');
    };

    return (
        <>
            <div className="auth">
                {authMode === "Log In" && <Login setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />}
                {authMode === "Sign Up" && <SignUp setAuthMode={setAuthMode} setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />}
                <div className="auth-mode">
                    <p>{authMode === "Log In" ? "New to TrailFinder?" : "Already on TrailFinder?"}</p>
                    <a onClick={toggleAuthMode}>{authMode === "Log In" ? "Sign Up" : "Log In"}</a>
                </div>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
        </>
    );
}

export default LoginPage;
