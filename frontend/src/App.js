import React, { useState, useEffect } from 'react';
import SliderBar from './components/SliderBar';

const App = () => {
    const [politician, setPolitician] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/politicians/Bernie%20Sanders')
            .then(response => response.json())
            .then(data => setPolitician(data));
    }, []);

    if (!politician) return <div>Loading...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{politician.name}</h1>
            <SliderBar score={70} />
        </div>
    );
};

export default App;
