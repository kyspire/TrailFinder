import React from 'react';
import {useNavigate} from "react-router-dom";

// Define a functional component for the Navbar
const Navbar = ({ status }) => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/home');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleProjectionClick = () => {
        navigate('/projectionpage');
    }

    return (
        <header>
            <div className="logo nav-button" onClick={handleLogoClick}>
                <img src="trailfinder.png" alt="TrailFinder" draggable="false" />
                <h1>TrailFinder</h1>
            </div>
            <span className="profile-button nav-button" onClick={handleProjectionClick}>Projection</span>
            <span className="status">{status}</span>
            <span className="profile-button nav-button" onClick={handleProfileClick}>Profile</span>
        </header>
    );
};

export default Navbar;
