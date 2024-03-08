import React, { useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import './StorefrontUpdate.css';
const StoreFrontUpdate = () => {
  //Getting id from link
  const {id} = useParams();

  //Storing the data from database into store using setStore function
  const[store, setStore] = useState({});

  //Handling form stuff
  const[name, setName] = useState("");
  const[desc, setDesc] = useState("");
  const [image, setImage] = useState("");

  //For going back to home page
  let navigate = useNavigate();


  //The useEffect hook that calls the getStore() function
  useEffect(() => {

    //The async function that fetches the data from the database
    const getStore = async () => {
      try {
        const response = await fetch(`http://localhost:3005/getStore/${id}`);
        const jsonData = await response.json();
        setStore(jsonData.data.stores);
      }
      catch (err) {
        console.log(err);
      }
    };

    //Being called
    getStore();

    setName(store.storefront_name || "");
    setDesc(store.storefront_description || "");
  }, [id, store.storefront_name, store.storefront_description, store.image]);

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
        let body = {
            name: name,
            description: desc,
        };
        if(image) {
          const formData = new FormData();
          formData.append("image", image);
          const imgres = await fetch("http://localhost:3005/upload", {
            method: "POST",
            body: formData
          });
          const parseImg = await imgres.json();
          body.image = parseImg.filename;
        }
        const response = await fetch(`http://localhost:3005/updateStore/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        console.log(response);
        setTimeout(() => {
          navigate(`/yourstores`);
        }, 1000);      
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
      <h1 className='text-center mt-5'>Update StoreFront</h1>
      <div className='store-update-container'>
        <div className='image-container'>
          <img
            src={require(`../images/${store.image?store.image:"avatar.png"}`)}
            alt="../images/avatar.png"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
        <div className='form-container'>
          <div>
            <label htmlFor='name'>Name:</label>
            <input type="text" className="form-control mt-2 mb-2" value={name}
            onChange={e => setName(e.target.value)}/>
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
        </div>
      </div>

      
      <div className="d-flex justify-content-between">
        <button className="btn btn-success mt-2" onClick={saveChanges}>Save Changes</button>
        <button className="btn btn-danger mt-2" onClick={goBack}>Go Back</button>
      </div>
    </div>
  )
}

export default StoreFrontUpdate;
