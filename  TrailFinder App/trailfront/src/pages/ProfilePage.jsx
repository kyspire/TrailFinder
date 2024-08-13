import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext.jsx';
import ProfileSection from '../components/ProfileSection';
import FriendsSection from '../components/FriendsSection';
import EquipmentSection from '../components/EquipmentSection';
import '../components/Profile.css';
import UserHikesTrailSection from "../components/UserHikesTrailSection.jsx";

const ProfilePage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const updateProfile = (updatedProfile) => {
        setProfile(updatedProfile);
    };

    const updateFriendCount = (increment) => {
        setProfile(prevProfile => ({
            ...prevProfile,
            NUMBEROFFRIENDS: prevProfile.NUMBEROFFRIENDS + increment
        }));
    };

    return (
        <div className="profile-page">
            <ProfileSection handleLogout={handleLogout} profile={profile} updateProfile={updateProfile} />
            <FriendsSection updateFriendCount={updateFriendCount} />
            <EquipmentSection />
            <UserHikesTrailSection />
        </div>
    );
}

export default ProfilePage;