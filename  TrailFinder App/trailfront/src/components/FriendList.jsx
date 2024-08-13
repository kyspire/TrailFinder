import React from 'react';

const FriendList = ({ friends, deleteFriend }) => {
    return (
        <div className="profile-list">
            {(friends && friends.length > 0) ? friends.map(friend => (
                <div key={friend.USERID}>
                    <img className="friend-picture"
                        src={(friend.PROFILEPICTURE) ? `data:image/jpeg;base64,${friend.PROFILEPICTURE}`
                            : "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
                        alt="Profile"
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
                        }}
                    />
                    <p>
                        Name: <b>{friend.NAME}</b>
                        <br />
                        Trails Hiked: <b>{friend.TRAILSHIKED}</b>
                        <br />
                        Experience Level: <b>{friend.EXPERIENCELEVEL}</b>
                        <br />
                        Date Friended: <b>{new Date(friend.DATEFRIENDED).toLocaleDateString()}</b>
                    </p>
                    <button className="delete-button negative" onClick={() => deleteFriend(friend.USERID)}>x</button>
                </div>
            )) : <div>Nothing to see here!</div>
            }
        </div>
    );
};

export default FriendList;