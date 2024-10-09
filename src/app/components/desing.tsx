import React, { useState } from 'react';

const DesignComponent = () => {
    
    const [gridSize, setGridSize] = useState<number>(3); 


    const handleGridChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setGridSize(Number(event.target.value));
    };



    return (
        <div className='flex w-64 '>
            <select onChange={handleGridChange} className='w-full'>
                <option value={3}>3x3</option>
                <option value={5}>5x5</option>
            </select>
        </div>
    );
};

export default DesignComponent;