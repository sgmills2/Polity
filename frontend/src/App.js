import React, { useState, useEffect } from 'react';
import CongressMembers from "./components/CongressMembers/CongressMembers";
import SliderBar from './components/SliderBar';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const App = () => {
    const [politician, setPolitician] = useState(null);
    const [score, setScore] = useState('');
    const [chamber, setChamber] = useState('');
    const [state, setState] = useState('');
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');

    // Get list of members when chamber and state are selected
    useEffect(() => {
        if (chamber && state) {
            fetch(`${API_URL}/members/${chamber}/${state}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => setMembers(data))
                .catch(error => {
                    console.error("Error fetching members:", error);
                    setMembers([]);
                });
        }
    }, [chamber, state]);

    // Get politician details when a member is selected
    useEffect(() => {
        if (selectedMember) {
            fetch(`${API_URL}/politicians/${encodeURIComponent(selectedMember)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => setPolitician(data))
                .catch(error => {
                    console.error("Error fetching politician:", error);
                    setPolitician({ name: selectedMember });
                });
        }
    }, [selectedMember]);

    const states = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ];

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Congress Portal</h1>

            {/* Selection Flow */}
            <div className="space-y-4 mb-8">
                {/* Chamber Selection */}
                <div>
                    <label className="block mb-2">Select Chamber:</label>
                    <select 
                        value={chamber} 
                        onChange={(e) => setChamber(e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                    >
                        <option value="">Select...</option>
                        <option value="senate">Senate</option>
                        <option value="house">House</option>
                    </select>
                </div>

                {/* State Selection */}
                {chamber && (
                    <div>
                        <label className="block mb-2">Select State:</label>
                        <select 
                            value={state} 
                            onChange={(e) => setState(e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="">Select...</option>
                            {states.map(st => (
                                <option key={st} value={st}>{st}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Member Selection */}
                {state && members.length > 0 && (
                    <div>
                        <label className="block mb-2">Select Member:</label>
                        <select 
                            value={selectedMember} 
                            onChange={(e) => setSelectedMember(e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="">Select...</option>
                            {members.map(member => (
                                <option key={member.id} value={member.name}>
                                    {member.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Display Selected Politician Info */}
            {politician && (
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold">{politician.name}</h2>
                    <SliderBar 
                        score={score} 
                        onChange={(newScore) => setScore(newScore)} 
                    />
                    <p>Current Score: {score}</p>
                </div>
            )}

            {/* CongressMembers Component */}
            <CongressMembers />
        </div>
    );
};

export default App;