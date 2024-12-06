import React, { useState } from 'react';
import CongressMembers from "./components/CongressMembers/CongressMembers";

const App = () => {
    const [chamber, setChamber] = useState('');
    const [state, setState] = useState('');

    const states = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Congress Member Ratings</h1>

            {/* Selection Flow */}
            <div className="flex gap-4 mb-8">
                {/* Chamber Selection */}
                <div className="w-1/2">
                    <label className="block mb-2 font-medium">Select Chamber:</label>
                    <select 
                        value={chamber} 
                        onChange={(e) => setChamber(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">Select...</option>
                        <option value="senate">Senate</option>
                        <option value="house">House</option>
                    </select>
                </div>

                {/* State Selection */}
                <div className="w-1/2">
                    <label className="block mb-2 font-medium">Select State:</label>
                    <select 
                        value={state} 
                        onChange={(e) => setState(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        disabled={!chamber}
                    >
                        <option value="">Select...</option>
                        {states.map(st => (
                            <option key={st} value={st}>{st}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* CongressMembers Component */}
            <CongressMembers chamber={chamber} state={state} />
        </div>
    );
};

export default App;