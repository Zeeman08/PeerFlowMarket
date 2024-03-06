import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
const NewProduct = () => {
  const { id } = useParams();

  // Handling form stuff
  const [name, setName] = useState("new product");
  const [desc, setDesc] = useState("new description");
  const [image, setImage] = useState("image.jpg");
  const[stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState([]);

  // For navigation
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTagSuggestions = async (prefix) => {
      try {
        const response = await fetch(`http://localhost:3005/getTags/${prefix}`);
        const jsonData = await response.json();
        setTagSuggestions(jsonData.data.tags);
      } catch (error) {
        console.error('Error fetching tag suggestions:', error);
      }
    };

    // Fetch tag suggestions when tags change
    fetchTagSuggestions(tagInput);
  }, [tagInput]);

  const handleTagSelection = (selectedTag) => {
    setTags((prevTags) => [...prevTags, selectedTag]);
    setTagInput(''); // Clear the tag input field after selection
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      setTags((prevTags) => [...prevTags, tagInput.trim()]);
      setTagInput(''); // Clear the tag input field after pressing Enter
    }
  };

  const removeTag = (removedTag) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== removedTag));
  };

  const saveChanges = async () => {
    try {
      if (tags.length < 1 || tags.length > 6) {
        alert('Number of tags should be between 1 and 6, inclusive.');
        return;
      }

      const body = {
        name: name,
        description: desc,
        price: price,
        image: image,
            stock: stock,
        tags: tags
      };


        if (stock < 0 || price < 0){
          alert("Stock and price cannot be negative!");
          return;
        }

      const response = await fetch(`http://localhost:3005/createProduct/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      console.log(response);
      navigate(`/yourstore/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const goBack = () => {
    navigate(`/yourstore/${id}`);
  };

  return (
    <div>
      <h1 className="text-center mt-5">New Product</h1>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          className="form-control mt-2 mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          className="form-control mt-2 mb-2"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="image">Image:</label>
        <input
          type="text"
          className="form-control mt-2 mb-2"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
      <div>
      <label htmlFor='stock'>Starting Stock:</label>
        <input type="number" className="form-control mt-2 mb-2" value={stock}
        onChange={e => setStock(e.target.value)}/>
      </div>
      <div>
        <label htmlFor="Price">Price:</label>
        <input
          type="number"
          className="form-control mt-2 mb-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
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
          value={tagInput}
          onChange={handleTagInputChange}
          onKeyDown={handleTagInputKeyDown}
        />
        <datalist id="tagSuggestions">
          {tagSuggestions.map((tag) => (
            <option key={tag.tag_id} value={tag.tag_name} onClick={() => handleTagSelection(tag.tag_name)} />
          ))}
        </datalist>
      </div>
      <div className="d-flex justify-content-between">
        <button className="btn btn-success mt-2" onClick={saveChanges}>
          Save Changes
        </button>
        <button className="btn btn-danger mt-2" onClick={goBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NewProduct;
