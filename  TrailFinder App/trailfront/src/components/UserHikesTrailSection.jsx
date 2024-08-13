import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';

const UserHikesTrailSection = () => {
    const [error, setError] = useState('');
    const { login } = useAuth();
    const [trails, setTrails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUserHikesTrail = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:65535/user/userhikestrail', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setTrails(data.userhikestrail);
            } else {
                setError(data.error || 'Failed to fetch userhikestrails');
            }
        } catch (error) {
            setError('Network error: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompleted = async () => {
        try {
            const response = await fetch('http://localhost:65535/divide-to-find-users-at-all-locations', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            console.log(data);
            if (data.success) {
                if (data.completed) {
                    alert("You are a master. You have completed every trail we have to offer!");
                } else {
                    alert("You are on your way to hike every trail we offer!")
                }
                setError('');
            } else {
                setError(data.error || 'Failed to fetch userhikestrails');
            }
        } catch (error) {
            setError('Network error: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserHikesTrail();
    }, []);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Hiked At</h1>
            <div className="profile-list">
                {(trails && trails.length > 0) ? trails.map(trail => (
                    <div key={trail.TRAILNAME}>
                        <p>
                            Trail Name: <b>{trail.TRAILNAME}</b>
                            <br />
                            Location Name: <b>{trail.LOCATIONNAME}</b>
                            <br />
                            Date Hiked: <b>{new Date(trail.DATEHIKED).toLocaleDateString()}</b>
                            <br />
                            Time to Comlete: <b>{trail.TIMETOCOMLETE}</b>
                            <br />
                        </p>
                    </div>
                )) : <div>Nothing to see here!</div>
                }
            </div>
            <div className="profile-inputs">
                <button className="positive" onClick={handleCompleted}>Complete All Locations?</button>
            </div>
        </div>
    );
};

export default UserHikesTrailSection;