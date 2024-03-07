import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/PersonContext';

const YourStore = () => {
  const { person } = useData();
  const { id } = useParams();
  const [store, setStore] = useState({});
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  const [displayProducts, setDisplay] = useState([]);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementPosted, setAnnouncementPosted] = useState(false);
  const [showNewAnnouncementButton, setShowNewAnnouncementButton] = useState(true);
  const navigate = useNavigate();

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

  const onSearch = async e => {
    e.preventDefault();
    setDisplay(products.filter(product => product.product_name.includes(searchText)));
  };

  const deleteProduct = async id => {
    try {
      const body = { person_id: person.person_id };
      const response = await fetch(`http://localhost:3005/deleteProduct/${id}`, {
        method: 'DELETE',
        body: JSON.stringify(body),
      });

      setProducts(products.filter(product => product.product_id !== id));
      setDisplay(displayProducts.filter(product => product.product_id !== id));
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const updateProduct = id => {
    try {
      navigate(`/product/${id}/update`);
    } catch (err) {
      console.log(err);
    }
  };

  const goBack = () => {
    navigate('/yourstores');
  };

  const postAnnouncement = async () => {
    try {
      const response = await fetch('http://localhost:3005/createAnnouncement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          person_id: person.person_id,
          storefront_id: id,
          description: announcementText,
        }),
      });

      if (response.ok) {
        setAnnouncementPosted(true);
        setShowAnnouncementForm(false);
        setAnnouncementText('');
        setShowNewAnnouncementButton(false); // Hide the "New Announcement" button
      }
    } catch (err) {
      console.error('Error posting announcement:', err);
    }
  };

  return (
    <div>
      <div>
        <h1 className='text-center mt-5'>{store.storefront_name}</h1>
      </div>

      <div>
        <form className='d-flex mt-4 mb-4' onSubmit={onSearch}>
          <input
            type='text'
            className='form-control'
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <button className='btn btn-outline-secondary'>Search</button>
        </form>
      </div>

      <div>
        <button className='btn btn-success mb-4' onClick={() => navigate(`/store/${id}/newProduct`)}>
          New Product
        </button>
      </div>

      {showNewAnnouncementButton && (
        <div>
          <button className='btn btn-success mb-4' onClick={() => setShowAnnouncementForm(true)}>
            New Announcement
          </button>
        </div>
      )}

      {showAnnouncementForm && (
        <div>
          <form className='mb-4'>
            <div className='mb-3'>
              <label htmlFor='announcementTextarea' className='form-label'>
                Type your announcement:
              </label>
              <textarea
                className='form-control'
                id='announcementTextarea'
                rows='3'
                value={announcementText}
                onChange={e => setAnnouncementText(e.target.value)}
              ></textarea>
            </div>
            <button
              type='button'
              className='btn btn-primary'
              onClick={postAnnouncement}
            >
              Post
            </button>
          </form>
        </div>
      )}

      {announcementPosted && (
        <p className='text-success text-center'>
          Announcement posted successfully!
        </p>
      )}

      <div>
        <table className='table table-hover table-secondary table-striped table-bordered text-center'>
          <thead className='table-dark'>
            <tr className='bg-primary'>
              <th scope='col'>Name</th>
              <th scope='col'>Tags</th>
              <th scope='col'>Description</th>
              <th scope='col'>Price</th>
              <th scope='col'>Rating</th>
              <th scope='col'>Image</th>
              <th scope='col'>Update</th>
              <th scope='col'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {displayProducts.map(product => (
              <tr key={product.product_id} onClick={e => console.log('Nothin happens :p')}>
                <td>{product.product_name}</td>
                <td>
                  <ul>
                    {product.tags.map((tag, index) => (
                      <li key={index}>{tag}</li>
                    ))}
                  </ul>
                </td>
                <td>{product.product_description}</td>
                <td>${product.price}</td>
                <td>{product.product_rating}</td>
                <td>{product.image}</td>
                <td>
                  <button className='btn btn-warning' onClick={() => updateProduct(product.product_id)}>
                    Update
                  </button>
                </td>
                <td>
                  <button className='btn btn-danger' onClick={() => deleteProduct(product.product_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className='btn btn-danger' onClick={goBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default YourStore;
