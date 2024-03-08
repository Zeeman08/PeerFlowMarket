import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import {useData} from '../context/PersonContext';

const NewStore = () => {
  //Getting id from link
  const {person} = useData();

  //Handling form stuff
  const[name, setName] = useState("new store");
  const[desc, setDesc] = useState("new description");
  const [image, setImage] = useState(null);
  /*******************/
  /* DROP DOWN STUFF */
  /*******************/

  const [isActive, setIsActive] = useState(false);
  const [selected, setSelected] = useState({category_name: "Select a category"});
  const [options, setOptions] = useState([]);

  //For going back to home page
  let navigate = useNavigate();

    //The useEffect hook that calls the getStores() function
    useEffect(() => {
  
      //The async function that fetches available categories
      const getCat = async () => {
        try {
          const response = await fetch("http://localhost:3005/getCategories");
          const jsonData = await response.json();
          setOptions(jsonData.data.categories);
  
          console.log(options);
  
        } catch (error) {
          console.log(error);
        }
      }
      
      getCat();
    }, []);

  /*************************/
  /**** ADD STORE STUFF ****/
  /*************************/
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
        if (selected.category_name === "Select a category")
          return;
        const formData = new FormData();
        formData.append("image", image);
  
        const imgres = await fetch("http://localhost:3005/upload", {
          method: "POST",
          body: formData
        });
  
        const parseImg = await imgres.json();
        const body = {
            name: name,
            category: selected.category_name,
            description: desc,
            image: parseImg.filename,
            owner: person.person_id
        };
        const response = await fetch("http://localhost:3005/createStore", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        console.log(response);
        navigate("/yourstores");
    }
    catch (err) {
        console.log(err)
    }
  };

  const goBack = () => {
    navigate(`/yourstores`);
  }

  return (
    <div>
      <h1 className='text-center mt-5'>New Store</h1>
      <div>
        <label htmlFor='name'>Name:</label>
        <input type="text" className="form-control mt-2 mb-2" value={name}
        onChange={e => setName(e.target.value)}/>
      </div>
      <div>
      <label htmlFor='description'>Category:</label>
          {/* drop down */}
          <div className="dropdown">
            <div className="dropdown-btn" onClick={e => setIsActive(!isActive)}>
              {selected.category_name}
              <span className="fas fa-caret-down"></span>
            </div>
            {isActive && (
              <div className="dropdown-content">
                {options.map(option => (
                  <div key={option.category_name} className="dropdown-item" onClick={e => {
                    setSelected(option);
                    setIsActive(false);
                  }}>{option.category_name}</div>
                ))}
              </div>
            )}
          </div>
      </div>
      <div>
      <label htmlFor='description'>Description:</label>
        <input type="text" className="form-control mt-2 mb-2" value={desc}
        onChange={e => setDesc(e.target.value)}/>
      </div>
      <div>
        <label htmlFor="image">Image:</label>
        <input type="file" name="image" className="form-control mt-2 mb-2" onChange={e => onFileChange(e)} />
      </div>
      <div className="d-flex justify-content-between">
        <button className="btn btn-success mt-2" onClick={saveChanges}>Create</button>
        <button className="btn btn-danger mt-2" onClick={goBack}>Go Back</button>
      </div>
    </div>
  )
}

export default NewStore;