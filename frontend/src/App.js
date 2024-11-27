import React, { useState, useEffect } from 'react';
import CongressMembers from "./components/CongressMembers/CongressMembers";
import SliderBar from './components/SliderBar';

const App = () => {
    const [politician, setPolitician] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/politicians/Bernie%20Sanders') // Replace with dynamic API endpoint if needed
            .then(response => response.json())
            .then(data => setPolitician(data))
            .catch(error => console.error("Error fetching politician:", error));
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Congress Portal</h1>

            {/* SliderBar for displaying specific politician details */}
            {politician ? (
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold">{politician.name}</h2>
                    <SliderBar score={70} />
                </div>
            ) : (
                <p>Loading politician data...</p>
            )}

            {/* CongressMembers Component */}
            <CongressMembers />
        </div>
    );
};

export default App;