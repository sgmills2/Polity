import React, { useState } from 'react';

const SliderBar = () => {
    const [score, setScore] = useState(50);

    const handleChange = (event) => {
        setScore(event.target.value);
    };

    return (
        <div>
            <input
                type="range"
                min="0"
                max="100"
                value={score}
                onChange={handleChange}
                className="w-full"
            />
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${score}%` }}
                ></div>
            </div>
        </div>
    );
};

export default SliderBar;