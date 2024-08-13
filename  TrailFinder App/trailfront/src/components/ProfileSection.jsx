import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import ProfileForm from './ProfileForm.jsx';
import ProfileInfo from './ProfileInfo';

const ProfileSection = ({ handleLogout, profile, updateProfile }) => {
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const { login } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:65535/user/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    updateProfile(data.profile);
                } else {
                    setError(data.error || 'Failed to fetch profile');
                }
            } catch (error) {
                setError('Network error: ' + error.message);
            }
        };

        if (!profile) {
            fetchProfile();
        }
    }, [profile, updateProfile]);

    const handleEditToggle = () => {
        setError(null);
        setIsEditing(!isEditing);
    };

    const handleProfileUpdate = async (updatedProfile) => {
        try {
            const response = await fetch('http://localhost:65535/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedProfile)
            });
            const data = await response.json();
            if (data.success) {
                alert("update profile success");
                if (data.token) {
                    login(data.token);
                }
                updateProfile({
                    ...profile,
                    NAME: updatedProfile.name,
                    EMAIL: updatedProfile.email,
                    PROFILEPICTURE: (updatedProfile.profilepictureurl) ? updatedProfile.profilepictureurl : profile.PROFILEPICTURE,
                });
                setIsEditing(false);
            } else {
                alert("update profile failed");
                setIsEditing(false);
                setError(data.error || 'Failed to update profile');
            }
        } catch (error) {
            alert("update profile failed");
            setError('Network error: ' + error.message);
        }
    };

    if (!profile) return <div>Loading...</div>;

    return (
        <div>
            <h1>Profile</h1>
            {isEditing ? (
                <ProfileForm
                    profile={profile}
                    onSubmit={handleProfileUpdate}
                    onCancel={handleEditToggle}
                />
            ) : (
                <ProfileInfo
                    profile={profile}
                    onEdit={handleEditToggle}
                    onLogout={handleLogout}
                />
            )}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default ProfileSection;