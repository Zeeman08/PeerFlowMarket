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
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  /*******************/
  /* FOR PAGINATION  */
  /*******************/
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const[searchTrigger, setSearchTrigger] = useState(0);
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
        const response = await fetch(`http://localhost:3005/getStoreProducts/${id}?rows_per_page=${productsPerPage}&page_number=${currentPage}&search=${searchText}`);
        const jsonData = await response.json();
        setProducts(jsonData.data.products);
        setDisplay(jsonData.data.products);
        setTotalPages(jsonData.data.totalPages);
      } catch (err) {
        console.log(err);
      }
    };

    getStore();
    getProducts();
  }, [id, currentPage, productsPerPage, searchTrigger]);

  products.forEach(product => {
    if (product.rating_count === 0) product.rating_count = 1;
  });

  // Handle pagination button click
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  // Handle rows per page change
  const handleRowsPerPageChange = (e) => {
    setProductsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when changing rows per page
  };

  const onSearch = async e => {
    e.preventDefault();
    setSearchTrigger(1-searchTrigger);
    e.preventDefault();
    //setDisplay(products.filter(product => product.product_name.includes(searchText)));
  };

  const deleteProduct = async id => {
    try {
      const body = { person_id: person.person_id };
      const response = await fetch(`http://localhost:3005/deleteProduct/${id}/${person.person_id}`, {
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

  const onFileChange = e => {

    // Set the selected file
    const file = e.target.files[0];
    setImage(file);

    // Resize image
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxSize = 223; // Maximum size for profile picture

        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio
        const aspectRatio = width / height;

        // Determine new dimensions while maintaining aspect ratio
        if (width > height) {
          width = maxSize;
          height = maxSize / aspectRatio;
        } else {
          height = maxSize;
          width = maxSize * aspectRatio;
        }

        // Create canvas and resize image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
          setImage(resizedFile);
        }, 'image/jpeg', 0.8); // Quality set to 80%
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };


  const postAnnouncement = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("image", image);
    try {
      const imgres = await fetch("http://localhost:3005/upload", {
        method: "POST",
        body: formData
      });

      const parseImg = await imgres.json();

      if (parseImg.filename === undefined) {
        parseImg.filename = "Deal.png";
      }

      const response = await fetch('http://localhost:3005/createAnnouncement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          person_id: person.person_id,
          storefront_id: id,
          description: announcementText,
          image: parseImg.filename,
        }),
      });

      if (response.ok) {
        setAnnouncementPosted(true);
        setShowAnnouncementForm(false);
        setAnnouncementText('');
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

      <div className="d-flex justify-content-evenly">
        <button className='btn btn-success mb-4' onClick={() => setShowAnnouncementForm(true)}>
          New Announcement
        </button>
        <button className='btn btn-primary mb-4' onClick={() => navigate(`/announcements/${id}`)}>
          View Announcements
        </button>
      </div>


      {showAnnouncementForm && (
        <div>
          <form className='mb-4'>
            <div className='mb-3'>
              <label htmlFor='announcementTextarea' className='form-label'>
                Type your announcement:
              </label>
              <input type="file" name="image" className="form-control my-3" onChange={e => onFileChange(e)} />
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

      {/* Rows per page dropdown */}
      <div  className='mb-5' style={{ textAlign: 'center', marginTop: '1rem' }}>
          <label htmlFor="rowsPerPage" style={{ marginRight: '0.5rem' }}>Rows per page:</label>
          <select id="rowsPerPage" value={productsPerPage} onChange={handleRowsPerPageChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>  


      <div>
        <table className='table table-hover table-secondary table-striped table-bordered text-center'>
          <thead className='table-dark'>
            <tr className='bg-primary'>
              <th scope='col'>Name</th>
              <th scope='col'>Description</th>
              <th scope='col'>Price</th>
              <th scope='col'>Rating</th>
              <th scope='col'>Stock</th>
              <th scope='col'>Sell Count</th>
              <th scope='col'>Image</th>
              <th scope='col'>Update</th>
              <th scope='col'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {displayProducts.map(product => (
              <tr key={product.product_id} onClick={e => console.log('Nothin happens :p')}>
                <td>{product.product_name}</td>
                <td>{product.product_description}</td>
                <td>${product.price}</td>
                <td>{product.product_rating.toFixed(1)}</td>
                <td>{product.stock_count}</td>
                <td>{product.items_sold}</td>
                <td>
                  {product.image && (
                      <img
                      src={require(`../images/${product.image?product.image:"avatar.png"}`)}
                      alt="../images/avatar.png"
                      style={{ width: '40%', height: 'auto', alignSelf: 'center'}}
                    />
                    )
                  }
                </td>
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

      {/* Pagination */}
      <div style={{ paddingBottom: '60px', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            style={{ padding: '0.5rem', marginRight: '1rem', cursor: 'pointer', backgroundColor: '#007BFF', color: 'white' }}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          <span className="mt-2" style={{ fontSize: '1rem', marginRight: '1rem' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            style={{ padding: '0.5rem', cursor: 'pointer', backgroundColor: '#007BFF', color: 'white' }}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </div>

    </div>
  );
};

export default YourStore;
