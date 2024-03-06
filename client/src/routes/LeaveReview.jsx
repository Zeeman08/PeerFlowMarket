import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/PersonContext';

const LeaveReview = () => {
  const {person} = useData();
  const { id } = useParams();
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = {
        rating: rating,
        comment: comment,
      };

      const response = await fetch(`http://localhost:3005/postReview/${id}/${person.person_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.status === 201) {
        console.log('Review submitted successfully!');
      } else {
        console.log('Failed to submit review.');
      }

      navigate(`/store/${id}`);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const goBack = () => {
    navigate(`/store/${id}`);
  };

  return (
    <div>
      <h1 className="text-center mt-5">Leave a Review</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="rating">Rating:</label>
          <select
            className="form-control mt-2 mb-2"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          >
            <option value="">Select Rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
        <div>
          <label htmlFor="comment">Comment:</label>
          <textarea
            className="form-control mt-2 mb-2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-success mt-2">
            Submit Review
          </button>
          <button type="button" className="btn btn-danger mt-2" onClick={goBack}>
            Go Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveReview;
