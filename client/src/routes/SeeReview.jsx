import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SeeReview = () => {
    const { id } = useParams();
    const [reviews, setReviews] = useState([]);
  
    console.log('id:', id);  // This should log the correct id
    console.log('params: ', useParams());  // This should log the correct id
    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const response = await fetch(`http://localhost:3005/getReviews/${id}`);
          const jsonData = await response.json();
          console.log('jsonData:', jsonData);
          setReviews(jsonData.data.reviews);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      };
  
      fetchReviews();
    }, [id]);

  return (
    <div>
      <h1 className="text-center mt-5">Product Reviews</h1>
      <div>
        <table className="table table-hover table-secondary table-striped table-bordered text-center mt-5">
          <thead className="table-dark">
            <tr className="bg-primary">
              <th scope="col">Person ID</th>
              <th scope="col">Posted On</th>
              <th scope="col">Comments</th>
              <th scope="col">Rating</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.person_id}>
                <td>{review.person_id}</td>
                <td>{review.posted_on}</td>
                <td>{review.comments}</td>
                <td>{review.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SeeReview;
