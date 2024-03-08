import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/PersonContext';

const StoreFront = () => {
  const { person } = useData();
  const { id } = useParams();
  const [store, setStore] = useState({});
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const navigate = useNavigate();
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

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
        setDisplayProducts(jsonData.data.products);
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

  const onSearch = async e => {
    e.preventDefault();
    setDisplayProducts(products.filter(product => product.product_name.includes(searchText)));
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
        setSubmittedFeedback(true);
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
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {displayProducts.map((product, index) => (
            <div
              key={product.product_id}
              style={{
                width: '400px',
                margin: '1rem',
                padding: '1rem',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column', // Align the button vertically
                alignItems: 'center',
              }}
              onClick={e => viewProduct(e, product.product_id)}
            >
              <div style={{ flexGrow: 1 , alignContent: 'center'}}>
                {product.image && (
                    <img
                    src={require(`../images/${product.image}`)}
                    alt="../images/avatar.png"
                    style={{ width: '60%', height: 'auto', alignSelf: 'center'}}
                  />
                  )
                }
                <h3 style={{ marginBottom: '0.5rem' }}>{product.product_name}</h3>
                <p style={{ marginBottom: '0.5rem' }}>
                  Price: ${product.price}
                </p>
                
              </div>
              
              <hr style={{ backgroundColor: 'gray', height: '1px', border: 'none', margin: '0.5rem 0' }} />
            </div>
          ))}
        </div>
        <button className="btn btn-danger" onClick={goBack}>
          Go Back
        </button>
      </div>

      <div className="text-center mb-4">
        {!showComplaintForm && !submittedFeedback && (
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
        submittedFeedback && (
          <p className="text-success text-center">
            Thanks for your feedback! We are looking into it.
          </p>
        )
      )}
    </div>
  );
};

export default StoreFront;
