import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
const NewProduct = () => {
  const { id } = useParams();

  // Handling form stuff
  const [name, setName] = useState("new product");
  const [desc, setDesc] = useState("new description");

  const [image, setImage] = useState(null);
  
  const[stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  // for tags
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [allTags, setAllTags] = useState([]);
  // For navigation
  const navigate = useNavigate();

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

  const saveChanges = async () => {
    try {
      if (tags.length < 1 || tags.length > 6) {
        alert('Number of tags should be between 1 and 6, inclusive.');
        return;
      }

      if (stock <= 0 || price <= 0){
        alert("Stock and price must be greater than 0.");
        return;
      }

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
        image: parseImg.filename,
        stock: stock,
        tags: tags
      };

      const response = await fetch(`http://localhost:3005/createProduct/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      console.log(response);
      //delayed navigation
      setTimeout(() => {
        navigate(`/yourstore/${id}`);
      }, 1000);
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
        <input type="file" name="image" className="form-control mt-2 mb-2" onChange={e => onFileChange(e)} />
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
      {/* Tags */}
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
        <datalist id="tagSuggestions">   {/*For autocompletion */}
          {tagSuggestions.map((tag) => (
            <option key={tag.tag_id} value={tag.tag_name} onMouseDown={() => handleTagSelection(tag.tag_name)} />
          ))}
        </datalist>
      </div>
      <div className="d-flex justify-content-between">
        <button className="btn btn-success mt-2" onClick={saveChanges}>
          Create
        </button>
        <button className="btn btn-danger mt-2" onClick={goBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NewProduct;
