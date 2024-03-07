import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/PersonContext';
const StoreFront = () => {
  const {person} = useData();
  const { id } = useParams();
  const [store, setStore] = useState({});
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  const [displayProducts, setDisplay] = useState([]);
  const navigate = useNavigate();
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    const getStore = async () => {
      try {
        const response = await fetch(`http://localhost:3005/getStore/${id}`);
        const jsonData = await response.json();
        setStore(jsonData.data.stores);
      } catch (err) {
        console.log(err);
      }
    };

    const getProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3005/getStoreProducts/${id}`);
        const jsonData = await response.json();
        setProducts(jsonData.data.products);
        setDisplay(jsonData.data.products);
      } catch (err) {
        console.log(err);
      }
    };

    getStore();
    getProducts();
  }, [id]);

  products.forEach(product => {
    if (product.rating_count === 0) product.rating_count = 1;
  });
  displayProducts.forEach(product => {
    if (product.rating_count === 0) product.rating_count = 1;
  });

  const onSearch = async e => {
    e.preventDefault();
    setDisplay(products.filter(product => product.product_name.includes(searchText)));
  };

  const viewProduct = (e, id) => {
    if (e.detail > 1) {
      navigate(`/product/${id}`);
    }
  };

  const goBack = () => {
    navigate('/stores');
  };

  const submitFeedback = async () => {
    try {
      const response = await fetch('http://localhost:3005/submitComplaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personId: person.person_id,
          storeId: id,
          complaintDetails: feedbackText,
        }),
      });

      if (response.ok) {
        setShowComplaintForm(false);
        setFeedbackText('');
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  return (
    <div>
      <div>
        <h1 className='text-center mt-5'>{store.storefront_name}</h1>
      </div>

      <div>
        <form className="d-flex mt-4 mb-4" onSubmit={onSearch}>
          <input
            type="text"
            className="form-control"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <button className="btn btn-outline-secondary">Search</button>
        </form>
      </div>

      <div>
        <table className="table table-hover table-secondary table-striped table-bordered text-center">
          <thead className="table-dark">
            <tr className="bg-primary">
              <th scope="col">Name</th>
              <th scope="col">Tags</th>
              <th scope="col">Description</th>
              <th scope="col">Price</th>
              <th scope="col">Rating</th>
              <th scope="col">Image</th>
            </tr>
          </thead>
          <tbody>
            {displayProducts.map(product => (
              <tr key={product.product_id} onClick={e => viewProduct(e, product.product_id)}>
                <td>{product.product_name}</td>
                <td>
                  {
                    <ul>
                      {product.tags.map((tag, index) => (
                        <li key={index}>{tag}</li>
                      ))}
                    </ul>
                  }
                </td>
                <td>{product.product_description}</td>
                <td>${product.price}</td>
                <td>{product.product_rating}</td>
                <td>{product.image}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-danger" onClick={goBack}>
          Go Back
        </button>
      </div>

      <div className="text-center mb-4">
        {!showComplaintForm && (
          <button
            className="btn btn-danger"
            onClick={() => setShowComplaintForm(true)}
          >
            Make a Complaint
          </button>
        )}
      </div>

      {showComplaintForm ? (
        <div>
          <form className="mb-4">
            <div className="mb-3">
              <label htmlFor="feedbackTextarea" className="form-label">
                Provide your feedback:
              </label>
              <textarea
                className="form-control"
                id="feedbackTextarea"
                rows="3"
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
              ></textarea>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={submitFeedback}
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        <p className="text-success text-center">
          Thanks for your feedback! We are looking into it.
        </p>
      )}
    </div>
  );
};

export default StoreFront;
