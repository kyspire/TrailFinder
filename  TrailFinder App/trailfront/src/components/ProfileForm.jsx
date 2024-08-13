import React, { useState } from 'react';

const ProfileForm = ({ profile, onSubmit, onCancel }) => {
    const [updatedProfile, setUpdatedProfile] = useState({
        name: profile.NAME,
        email: profile.EMAIL,
        profilepictureurl: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(updatedProfile);
    };

    return (
        <form onSubmit={handleSubmit} className="profile-form">
            <div className="profile-form-group">
                <label>Name:</label>
                <input type="text" name="name" value={updatedProfile.name} onChange={handleChange} />
            </div>
            <div className="profile-form-group">
                <label>Email:</label>
                <input type="text" name="email" value={updatedProfile.email} onChange={handleChange} />
            </div>
            <div className="profile-form-group">
                <label>Profile Picture URL:</label>
                <input type="text" name="profilepictureurl" value={updatedProfile.profilepictureurl} onChange={handleChange} />
            </div>
            <div className="profile-inputs">
                <button className="positive" type="submit">Save</button>
                <button className="negative" type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default ProfileForm;