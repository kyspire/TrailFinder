import React, { useState } from 'react';
import { useAuth } from "./AuthContext.jsx";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import './Auth.css';

const Login = ({ setErrorMessage, setSuccessMessage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:65535/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                login(data.token);
                setSuccessMessage('Login successful!');
                setErrorMessage('');
                navigate('/home');
            } else {
                setErrorMessage(data.error);
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again.');
            setSuccessMessage('');
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await fetch('http://localhost:65535/auth/google-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: tokenResponse.access_token }),
                });
                const data = await response.json();
                if (response.ok) {
                    login(data.token);
                    setSuccessMessage('Google login successful!');
                    setErrorMessage('');
                    navigate('/home');
                } else {
                    setErrorMessage(data.error);
                    setSuccessMessage('');
                }
            } catch (error) {
                console.error('Error:', error);
                setErrorMessage('An error occurred. Please try again.');
                setSuccessMessage('');
            }
        },
        onError: () => {
            console.error('Google Login Failed');
            setErrorMessage('Google login failed. Please try again.');
            setSuccessMessage('');
        },
    });

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <h1>Log In</h1>
            <form onSubmit={handleLogin}>
                <div className="auth-input">
                    <input type="email" name="email" required autoComplete="off" placeholder=""
                           onChange={(e) => setEmail(e.target.value)}/>
                    <label htmlFor="email">Email</label>
                </div>
                <div className="auth-input">
                    <input type={showPassword ? "text" : "password"} name="password" required
                           autoComplete="off" placeholder="" onChange={(e) => setPassword(e.target.value)}/>
                    <label htmlFor="password">Password</label>
                </div>
                <div className="show-password">
                    <input type="checkbox" name="showPassword" checked={showPassword}
                           onChange={toggleShowPassword}/>
                    <span className="checkbox" onClick={toggleShowPassword}></span>
                    <label htmlFor="showPassword">Show Password</label>
                </div>
                <button type="submit">Log In</button>
            </form>
            <button onClick={() => googleLogin()} className="google-login-button">
                Continue with Google
            </button>
        </>
    );
};

export default Login;
