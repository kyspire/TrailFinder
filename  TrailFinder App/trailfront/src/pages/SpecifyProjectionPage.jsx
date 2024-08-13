import React, { useState, useEffect } from 'react';
import '../components/ProjectionPage.css';

const SpecifyProjection = () => {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [tableAttributes, setTableAttributes] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState([]);
    const [projectionResult, setProjectionResult] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchTables();
    }, []);

    useEffect(() => {
        if (selectedTable) {
            fetchTableAttributes(selectedTable);
        }
    }, [selectedTable]);

    const fetchTables = async () => {
        setMessage('');
        try {
            const response = await fetch('http://localhost:65535/getTables');
            const data = await response.json();
            if (data.success) {
                setTables(data.tables);
            }
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    const fetchTableAttributes = async (tableName) => {
        setMessage('');
        try {
            const response = await fetch(`http://localhost:65535/getTableAttributes?table=${tableName}`);
            const data = await response.json();
            if (data.success) {
                setTableAttributes(data.attributes);
            }
        } catch (error) {
            console.error('Error fetching table attributes:', error);
        }
    };

    const handleTableChange = (e) => {
        setMessage('');
        setSelectedTable(e.target.value);
        setSelectedAttributes([]);
    };

    const handleAttributeChange = (e) => {
        setMessage('');
        const attribute = e.target.value;
        setSelectedAttributes(prev =>
            prev.includes(attribute)
                ? prev.filter(a => a !== attribute)
                : [...prev, attribute]
        );
    };

    const submitProjection = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:65535/projectTrailAttributes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    table: selectedTable,
                    attributes: selectedAttributes
                }),
            });

            const data = await response.json();
            if (data.success) {
                setMessage("Projection Success!");
                setProjectionResult(data.data);
            } else {
                setMessage("Projection Failed!");
                console.error('Projection failed:', data.error);
            }
        } catch (error) {
            setMessage("Projection Failed!");
            console.error('Error submitting projection:', error);
        }
    };

    return (
        <div className='projection-page'>
            <h1>See Your Data!</h1>
            <p>Select a table and choose the attributes you want to view.</p>
            <form onSubmit={submitProjection}>
                <div>
                    <select value={selectedTable} onChange={handleTableChange}>
                        <option value="">Select a table</option>
                        {tables.map(table => (
                            <option key={table} value={table}>{table}</option>
                        ))}
                    </select>
                    <button type="submit" className="positive" disabled={!selectedTable || selectedAttributes.length === 0}>
                        Project Data
                    </button>
                </div>
                {selectedTable && (
                    <div>
                        <h3>Select Attributes:</h3>
                        {tableAttributes.map(attr => (
                            <label key={attr}>
                                <input
                                    type="checkbox"
                                    value={attr}
                                    checked={selectedAttributes.includes(attr)}
                                    onChange={handleAttributeChange}
                                />
                                {attr}
                            </label>
                        ))}
                    </div>
                )}
            </form>
            {message && <div>{message}</div>}
            {projectionResult && (
                <div>
                    <h2>Projection Result</h2>
                    <table>
                        <thead>
                            <tr>
                                {selectedAttributes.map(attr => (
                                    <th key={attr}>{attr}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {projectionResult.map((row, index) => (
                                <tr key={index}>
                                    {selectedAttributes.map(attr => (
                                        <td key={attr}>{row[attr]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SpecifyProjection;