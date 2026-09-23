import React, { useState, useEffect } from 'react';

const Rating = ({ initialRating, onRate }) => {

    const [rating, setRating] = useState(initialRating || 0);

    const handleRating = (value) => {
        setRating(value);
        if (onRate) onRate(value);
    };

    useEffect(() => {
        if (initialRating) {
            setRating(initialRating);
        }
    }, [initialRating]);

    return (
        <div className="flex gap-1.5 items-center">
            {Array.from({ length: 5 }, (_, index) => {
                const starValue = index + 1;
                return (
                    <span
                        key={index}
                        className={`text-xl sm:text-2xl cursor-pointer transition-transform hover:scale-110 ${starValue <= rating ? 'text-[#A84B2A]' : 'text-[#DCE5E3]'}`}
                        onClick={() => handleRating(starValue)}
                    >
                        &#9733;
                    </span>
                );
            })}
        </div>
    );
};

export default Rating;