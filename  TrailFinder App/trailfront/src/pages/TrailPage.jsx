import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../components/Trail.css';

function TrailPage() {
    const location = useLocation();
    const { locationname, latitude, longitude, trailname, timetocomplete, description, hazards, difficulty } = location.state || {};
    const [previews, setPreviews] = useState([]);
    const [transportation, setTransportation] = useState([]);
    const [retailerGear, setRetailerGear] = useState([]);
    const [ugc, setUGC] = useState([]);
    const [userID, setUserID] = useState(null);
    const [error, setError] = useState();
    const [rating, setRating] = useState(0);
    const [newDescription, setNewDescription] = useState('');
    const [newRating, setNewRating] = useState(null);

    const fetchUserID = async () => {
        try {
            const response = await fetch(`http://localhost:65535/auth/verify-token`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.valid) {
                setUserID(data.userId);
            } else {
                setError(data.error || 'Failed to fetch Previews');
            }
        } catch (error) {
            setError('Network error: ' + error.message);
        }
    };

    const fetchPreviews = async () => {
        try {
            const response = await fetch(`http://localhost:65535/previews?locationname=${locationname}&latitude=${latitude}&longitude=${longitude}&trailname=${trailname}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setPreviews(data.previews);
            } else {
                setError(data.error || 'Failed to fetch Previews');
            }
        } catch (error) {
            setError('Network error: ' + error.message);
        }
    };

    const fetchTransportationToLocation = async () => {
        try {
            const response = await fetch(`http://localhost:65535/transportation-to-location?locationname=${locationname}&latitude=${latitude}&longitude=${longitude}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setTransportation(data.transportation);
            } else {
                setError(data.error || 'Failed to fetch Transportation');
            }
        } catch (error) {
            setError('Network error: ' + error.message);
        }
    };

    const fetchRetailerGear = async () => {
        try {
            const response = await fetch(`http://localhost:65535/retailer-gear?locationname=${locationname}&latitude=${latitude}&longitude=${longitude}&trailname=${trailname}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setRetailerGear(data.retailerGear);
            } else {
                setError(data.error || 'Failed to fetch Retailers and Gear');
            }
        } catch (error) {
            setError('Network error: ' + error.message);
        }
    };

    const fetchUGC = async () => {
        try {
            const response = await fetch(`http://localhost:65535/ugc?locationname=${locationname}&latitude=${latitude}&longitude=${longitude}&trailname=${trailname}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setUGC(data.ugc);
            } else {
                setError(data.error || 'Failed to fetch UGC');
            }
        } catch (error) {
            setError('Network error: ' + error.message);
        }
    };

    const fetchJoinUserUGC = async () => {
        try {
            const response = await fetch(`http://localhost:65535/ugc/user?locationname=${locationname}&latitude=${latitude}&longitude=${longitude}&trailname=${trailname}&rating=${rating}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                if (data.ugc.length === 0) {
                    setUGC(null);
                } else {
                    setUGC(data.ugc);
                }
            } else {
                setError(data.error || 'Failed to fetch UGC');
            }
        } catch (error) {
            setError('Network error: ' + error.message);
        }
    };

    const handleAddReview = async () => {
        try {
            const response = await fetch(`http://localhost:65535/ugc/review`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({locationname, latitude, longitude, trailname, message: newDescription, rating: newRating})
            });
            const data = await response.json();
            if (data.success) {
                setRating(0);
                await fetchUGC();
            } else {
                setError(data.error || 'Failed to fetch UGC');
            }
        } catch (error) {
            setError('Network error: ' + error.message);
        }
    }

    const handleDeleteReview = async (ugcID) => {
        try {
            const response = await fetch(`http://localhost:65535/ugc/review`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ugcid: ugcID })
            });
            const data = await response.json();
            if (data.success) {
                setRating(0);
                alert("delete review success");
                setUGC(prevUGC => prevUGC.filter(item => item.UGCID !== ugcID));
            } else {
                alert("delete review failed");
                setError(data.error || 'Failed to delete review');
            }
        } catch (error) {
            alert("delete review failed");
            setError('Network error: ' + error.message);
        }
    };

    const handleRatingChange = (event) => {
        setRating(Number(event.target.value));
    };

    const handleNewRatingChange = (event) => {
        setNewRating(Number(event.target.value));
    };

    const handleNewDescriptionChange = (event) => {
        setNewDescription(event.target.value);
    };

    useEffect(() => {
        fetchUserID();
        fetchPreviews();
        fetchTransportationToLocation();
        fetchRetailerGear();
        fetchUGC();
    }, []);

    useEffect(() => {
        if (rating !== 0) {
            fetchJoinUserUGC();
        }
    }, [rating]);

    return (
        <div className="trail-page">
            <div className="trail-info trail-title">
                <div className="left">
                    <h1>{trailname}</h1>
                </div>
                <div className="right">
                    <h2>{locationname}</h2>
                    <b>{latitude}° {latitude >= 0 ? 'N' : 'S'} {longitude}° {longitude >= 0 ? 'E' : 'W'}</b>
                </div>
            </div>
            <div className="previews">
                <ul>
                    {previews.map((item, index) => (
                        <div key={index}> {item.IMAGE}</div>
                    ))}
                </ul>
            </div>
            <div className="trail-info">
                <div className="left">
                    <b>Time to Complete<span> : {timetocomplete} (hrs:mins)</span></b>
                </div>
                <div className="right">
                    <b>Difficulty<span> : {difficulty}</span></b>
                </div>
            </div>
            <div className="trail-info">
                <div className="description left">
                    <b>Description</b>
                    <p>&nbsp;</p>
                    <p>{description}</p>
                </div>
                <div className="hazards right">
                    <b>Hazards</b>
                    <p>&nbsp;</p>
                    <ul>
                        {hazards.split(',').map((item, index) => (
                            <li key={index}>
                                {item.trim()}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="trail-info">
                <div className="full">
                    <b>Transportation</b>
                    <p>&nbsp;</p>
                    <ul>
                        {transportation.map((item, index) => (
                            <li key={index}>
                                <b>{item.TYPE}</b>
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                Trip Cost : <b>${item.TRIPCOST}</b>
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                Rate : <b>${item.TRANSPORTCOST}/km</b>
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                Duration : <b>{item.DURATION.match(/\d{2}:\d{2}/)}</b> (hrs:mins)
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="trail-info">
                <div className="full">
                    <b>Recommended Gear</b>
                    <p>&nbsp;</p>
                    <ul>
                        {retailerGear.map((item, index) => (
                            <li key={index}>
                                <b>{item.GEARNAME}</b> ({item.GEARTYPE})
                                <p>&nbsp;</p>
                                <b><a href={item.PRODUCTWEBSITE}>{item.PRODUCTNAME}</a></b> — {item.RETAILERNAME}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="trail-info">
                <div className="full">
                    <b>Reviews ({(ugc) ? ugc.length : 0})</b>
                    <p>&nbsp;</p>
                    <div className="new-review">
                        <input
                            type="text"
                            placeholder="Enter review description"
                            value={newDescription}
                            onChange={handleNewDescriptionChange}
                        />
                        <input
                            type="number"
                            placeholder="Rating 1-5 ★"
                            value={newRating}
                            onChange={handleNewRatingChange}
                        />
                    </div>
                    <button className="positive" onClick={handleAddReview}>Add Review</button>
                    <p>&nbsp;</p>
                    <b>Show by Rating</b>
                    <div className="rating-selection">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <label key={num}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value={num}
                                    checked={rating === num}
                                    onChange={handleRatingChange}
                                />
                                {num} ★
                            </label>
                        ))}
                    </div>
                    <button className="positive" onClick={() => {
                        setRating(0);
                        fetchUGC();
                    }}>Clear</button>
                    <p>&nbsp;</p>
                    {(ugc) ? ugc.map((item, index) => (
                        <li key={index}>
                            <b>{item.NAME}</b>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            {item.RATING &&
                                <>
                                    <b>{item.RATING} ★</b>
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                </>
                            }
                            <b>{new Date(item.DATEPOSTED.split('T')[0]).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</b>
                            {item.IMAGE &&
                                <>
                                    <p>&nbsp;</p>
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    {item.IMAGE}
                                </>
                            }
                            {item.DESCRIPTION &&
                                <>
                                    <p>&nbsp;</p>
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    {item.DESCRIPTION}
                                </>
                            }
                            <p>&nbsp;</p>
                            {item.USERID == userID && <button className="delete-review-button negative" onClick={()=>handleDeleteReview(item.UGCID)}>x</button>}
                        </li>
                    )) : <div>No Reviews Found</div>}
                </div>
            </div>
        </div>
    );
}

export default TrailPage;
