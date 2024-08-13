import React, { useState, useEffect } from 'react';

const EquipmentSection = () => {
    const [equipment, setEquipment] = useState([]);
    const [error, setError] = useState('');

    const fetchEquipment = async () => {
        try {
            const response = await fetch('http://localhost:65535/user/equipment', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setEquipment(data.equipment);
            } else {
                setError(data.error || 'Failed to fetch equipment');
            }
        } catch (error) {
            setError('Network error: ' + error.message);
        }
    };

    useEffect(() => {
        fetchEquipment();
    }, []);

    return (
        <div>
            <h1>Equipment</h1>
            <div className="profile-list">
                {(equipment && equipment.length > 0) ? equipment.map(equip => (
                    <div>
                        <p key={equip.EQUIPMENTID}>
                            Type: <b>{equip.TYPE}</b>
                            <br />
                            Brand: <b>{equip.BRAND}</b>
                            <br />
                            Amount: <b>{equip.AMOUNT}</b>
                            <br />
                            Weight: <b>{equip.WEIGHT}kg</b>
                        </p>
                    </div>
                )) : <div>Nothing to see here!</div>
                }
            </div>
            {/* <div className="profile-inputs">
                <button className="positive">Add Equipment</button>
            </div> */}
        </div>
    );
};

export default EquipmentSection;