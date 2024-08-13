import React, { useState } from 'react';
import './Auth.css';

const SignUp = ({ setAuthMode, setErrorMessage, setSuccessMessage }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    async function handleSignUp(e) {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:65535/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage('Registration successful! Please log in.');
                setErrorMessage('');
                setAuthMode("Log In");
            } else {
                setErrorMessage(data.error);
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again.');
            setSuccessMessage('');
        }
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <h1>Sign Up</h1>
            <form onSubmit={handleSignUp}>
                <div className="auth-input">
                    <input type="text" name="name" required autoComplete="off" placeholder=""
                           onChange={(e) => setName(e.target.value)}/>
                    <label htmlFor="name">Full Name</label>
                </div>
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
                <button type="submit">Sign Up</button>
            </form>
        </>
    );
};

export default SignUp;
