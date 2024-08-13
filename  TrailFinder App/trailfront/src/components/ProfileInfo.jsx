import React from 'react';

const ProfileInfo = ({ profile, onEdit, onLogout }) => {
    return (
        <>
            <img className="profile-picture"
                src={(profile.PROFILEPICTURE) ? `data:image/jpeg;base64,${profile.PROFILEPICTURE}`
                    : "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
                alt="Profile"
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = (profile.PROFILEPICTURE) ? profile.PROFILEPICTURE
                        : "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
                }}
            />
            <div className="profile-info">
                <p>Name: <b>{profile.NAME}</b></p>
                <p>Email: <b>{profile.EMAIL}</b></p>
                <p>Trails Hiked: <b>{profile.TRAILSHIKED}</b></p>
                <p>Experience Level: <b>{profile.EXPERIENCELEVEL}</b></p>
                <p>Number of Friends: <b>{profile.NUMBEROFFRIENDS}</b></p>
            </div>
            <div className="profile-inputs">
                <button className="positive" onClick={onEdit}>Edit</button>
                <button className="negative" onClick={onLogout}>Logout</button>
            </div>
        </>
    );
};

export default ProfileInfo;