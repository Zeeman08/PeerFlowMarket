import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './ProductUpdate.css';
const ProductUpdate = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(0);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3005/getProduct/${id}`);
        const jsonData = await response.json();
        setProduct(jsonData.data.product);
      } catch (err) {
        console.log(err);
      }
    };

    getProduct();
    setName(product.product_name || "");
    setDesc(product.product_description || "");
    setImage(product.image || "");
    setPrice(product.price || 0);
    setTags(product.tags || []);
  }, [id, product.product_name]);

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

    fetchAllTags();
  }, []);

  useEffect(() => {
    const fetchTagSuggestions = (prefix) => {
      const filteredTags = allTags.filter((tag) =>
        tag.tag_name.toLowerCase().startsWith(prefix.toLowerCase())
      );

      setTagSuggestions(filteredTags);
    };

    fetchTagSuggestions(tagInput);
  }, [tagInput, allTags]);

  const handleTagSelection = (selectedTag) => {
    setTags((prevTags) => [...prevTags, selectedTag]);
    setTagInput('');
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      setTags((prevTags) => [...prevTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (removedTag) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== removedTag));
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
        const maxSize = 600; // Maximum size for product photo

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

  const saveChanges = async (e) => {
    try {
      const formData = new FormData();
      formData.append("image", image);
      const imgres = await fetch("http://localhost:3005/upload", {
        method: "POST",
        body: formData
      });
      const parseImg = await imgres.json();
      const body = {
        name: name,
        description: desc,
        price: price,
        tags: tags,
        image: parseImg.filename,
      };
      const response = await fetch(`http://localhost:3005/updateProduct/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      console.log(response);
      navigate(`/yourstore/${product.storefront_id}`);
    } catch (err) {
      console.log(err)
    }
  };

  const goBack = () => {
    navigate(`/yourstore/${product.storefront_id}`);
  };

  return (
    <div>
      <h1 className='text-center mt-5'>Update Product</h1>
      <div className="product-update-container">
        <div className="image-container">
          <img
              src={require(`../images/${product.image?product.image:"avatar.png"}`)}
              alt="Product Image"
              style={{ width: '100%', height: 'auto' }}
            />
        </div>
        <div className="form-container">
          <div>
            <label htmlFor='name'>Name:</label>
            <input type="text" className="form-control mt-2 mb-2" placeholder={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor='description'>Description:</label>
            <input type="text" className="form-control mt-2 mb-2" placeholder={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div>
            <label htmlFor='Price'>Price:</label>
            <input type="number" className="form-control mt-2 mb-2" placeholder={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div>
            <label htmlFor="image">Image:</label>
            <input type="file" name="image" className="form-control mt-2 mb-2" onChange={e => onFileChange(e)} />
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
            <button className="btn btn-success mt-2" onClick={saveChanges}>Save Changes</button>
            <button className="btn btn-danger mt-2" onClick={goBack}>Go Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductUpdate;
