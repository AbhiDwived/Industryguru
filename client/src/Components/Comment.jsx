import React, { useState } from 'react';

const RatingsAndReviews = () => {
    const [ratings, setRatings] = useState({
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    });

    const handleRatingChange = (rating) => {
        setRatings({
            ...ratings,
            [rating]: ratings[rating] + 1,
        });
    };

    const totalCount = Object.values(ratings).reduce((acc, curr) => acc + curr, 0);
    const totalScore = Object.entries(ratings).reduce((acc, [rating, count]) => acc + (parseInt(rating) * count), 0);
    const overallRating = totalCount === 0 ? 0 : (totalScore / totalCount).toFixed(1);

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-2 mt-3">
                    <h1> {overallRating}★</h1>
                    Total Reviews: {totalCount}
                </div>
                <div className="col-sm-3 rating-container">
                    <div>
                        <button onClick={() => handleRatingChange(5)}>5★</button>
                        <span className="count">{ratings[5]}</span>
                        <div className="bar">
                            <div className="bar-fill" style={{ width: `${ratings[5]}px` }}></div>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => handleRatingChange(4)}>4★</button>
                        <span className="count">{ratings[4]}</span>
                        <div className="bar">
                            <div className="bar-fill" style={{ width: `${ratings[4]}px` }}></div>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => handleRatingChange(3)}>3★</button>
                        <span className="count">{ratings[3]}</span>
                        <div className="bar">
                            <div className="bar-fill" style={{ width: `${ratings[3]}px` }}></div>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => handleRatingChange(2)}>2★</button>
                        <span className="count">{ratings[2]}</span>
                        <div className="bar">
                            <div className="bar-fill" style={{ width: `${ratings[2]}px` }}></div>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => handleRatingChange(1)}>1★</button>
                        <span className="count">{ratings[1]}</span>
                        <div className="bar">
                            <div className="bar-fill" style={{ width: `${ratings[1]}px` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RatingsAndReviews;
