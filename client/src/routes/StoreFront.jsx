import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/PersonContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

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
  const[searchTrigger, setSearchTrigger] = useState(0);
  /*******************/
  /* FOR PAGINATION  */
  /*******************/
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  /*********************/
  /* ADVANCED SEARCHING*/
  /*********************/
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedSearchInput, setAdvancedSearchInput] = useState('');
  // varibles for tags
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [allTags, setAllTags] = useState([]);
  // functions to implement tags
  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const response = await fetch("http://localhost:3005/getTags/");
        const jsonData = await response.json();
        setAllTags(jsonData.data.tags);
      } catch (error) {
        console.error('Error fetching all tags:', error);
      }
    };

    // Fetch all tags when the component mounts
    fetchAllTags();
  }, []);
  useEffect(() => {
    const fetchTagSuggestions = (prefix) => {
      // Filter tags from allTags that have a similar prefix as tagInput
      if(prefix === "") {
        setTagSuggestions([]);
        return;
      }
      const filteredTags = allTags.filter((tag) =>
        tag.tag_name.toLowerCase().startsWith(prefix.toLowerCase())
      );
  
      setTagSuggestions(filteredTags);
    };

    // Fetch tag suggestions when tags change
    fetchTagSuggestions(tagInput);
  }, [tagInput]);
  const handleTagSelection = (selectedTag) => {
    // if the selected tag is already in the tags array, don't add it again
    if (tags.includes(selectedTag)) {
      alert('Tag already added!');
      return;
    }
    // if selected tag contains | we dont allow it
    if (selectedTag.includes("|")){
      alert('Tag cannot contain |');
      return;
    }
    if(selectedTag.length > 20){
      alert('Tag cannot be longer than 20 characters');
      return;
    }
    setTags((prevTags) => [...prevTags, selectedTag]);
    setTagInput(''); // Clear the tag input field after selection
    console.log('we are here');
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      if (tags.includes(tagInput)) {
        alert('Tag already added!');
        return;
      }
      // if selected tag contains | we dont allow it
      if (tagInput.includes("|")){
        alert('Tag cannot contain |');
        return;
      }
      if(tagInput.length > 20){
        alert('Tag cannot be longer than 20 characters');
        return;
      }
      setTags((prevTags) => [...prevTags, tagInput.trim()]);
      setTagInput(''); // Clear the tag input field after pressing Enter
    }
  };

  const removeTag = (removedTag) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== removedTag));
  };
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
        let url = `http://localhost:3005/getStoreProducts/${id}?rows_per_page=${productsPerPage}&page_number=${currentPage}&search=${searchText}`;
        if (tags.length > 0) {
          url += `&tags=${tags.join('|')}`;   // should somehow prevent the user from entering | in the tag
        }
        console.log(url);
        const response = await fetch(url);
        const jsonData = await response.json();
        setProducts(jsonData.data.products);
        setDisplayProducts(jsonData.data.products);
        setTotalPages(jsonData.data.totalPages);
        console.log(jsonData.data);
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

  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
    setAdvancedSearchInput(''); // Clear the input when toggling
  };

  const onAdvancedSearch = () => {
    setSearchText(advancedSearchInput);
    setSearchTrigger(1 - searchTrigger); // Trigger the search with the updated searchText
  };


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
    if (tags.length < 1 || tags.length > 6) {
      alert('Number of tags should be between 1 and 6, inclusive.');
      return;
    }
    setSearchTrigger(1-searchTrigger);
    //setDisplayProducts(products.filter(product => product.product_name.includes(searchText)));
  };

  const viewProduct = (e, id) => {
    navigate(`/product/${id}`);
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

      {/* Advanced Search */}
      <div>
        <button className="btn btn-outline-primary" onClick={toggleAdvancedSearch}>
          Advanced Searching
        </button>
        {showAdvancedSearch && (
          <div>
            <label htmlFor="tags">Tags:</label>
            <div>
              {tags.map((tag) => (
                <span key={tag} className="tag-container">
                  <span className="tag">
                    {tag}
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeTag(tag)}>
                    <FontAwesomeIcon icon={faTimes} size="xs" />
                    </button>
                  </span>
                </span>
              ))}
            </div>
            <input
              list="tagSuggestions"
              type="text"
              className="form-control mt-2 mb-2"
              placeholder="Enter tags for advanced search"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
            />
            <datalist id="tagSuggestions">{/* for autocompletion */}
              {tagSuggestions.map((tag) => (
                <option key={tag.tag_id} value={tag.tag_name} onClick={() => handleTagSelection(tag.tag_name)} />
              ))}
            </datalist>
          </div>
        )}
      </div>



      {/* Rows per page dropdown */}
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <label htmlFor="rowsPerPage" style={{ marginRight: '0.5rem' }}>Rows per page:</label>
          <select id="rowsPerPage" value={productsPerPage} onChange={handleRowsPerPageChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>  

      <div className="mt-4">
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
                <p style={{ marginBottom: '0.5rem' }}>
                  Rating: {product.product_rating}
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

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
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

      <div className="text-center mb-4 mt-4">
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
