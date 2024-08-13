import React, { useState, useEffect } from 'react';
import FriendList from './FriendList';

const FriendsSection = ({ updateFriendCount }) => {
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState('');
    const [friendEmail, setFriendEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchFriends = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:65535/user/friends', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setFriends(data.friends);
            } else {
                setError(data.error || 'Failed to fetch friends');
            }
        } catch (error) {
            setError('Network error: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    async function addFriend() {
        if (!friendEmail.trim()) {
            setError("Please enter an email");
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:65535/user/friends', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ friendEmail: friendEmail })
            });
            const data = await response.json();
            if (data.success) {
                alert("add friend success");
                await fetchFriends(); // Refetch the friends list
                setFriendEmail(''); // Clear the input field
                updateFriendCount(1); // Increment friend count
            } else {
                alert("add friend failed");
                setError(data.error);
            }
        } catch (e) {
            alert("add friend failed");
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function deleteFriend(friendId) {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:65535/user/friend', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ friendId: friendId })
            });
            const data = await response.json();
            if (data.success) {
                alert("delete friend success");
                await fetchFriends();
                updateFriendCount(-1); // Decrement friend count
            } else {
                alert("delete friend failed");
                setError(data.error);
            }
        } catch (e) {
            alert("delete friend failed");
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Friends</h1>
            <FriendList friends={friends} deleteFriend={deleteFriend} />
            <div className="profile-inputs">
                <input
                    className="friend-input"
                    type="email"
                    placeholder="Enter friend's email"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                />
                <button className="positive" onClick={addFriend} disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Friend'}
                </button>
            </div>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default FriendsSection;