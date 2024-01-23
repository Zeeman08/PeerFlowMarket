import React, { useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

const StoreFrontUpdate = () => {
  //Getting id from link
  const {id} = useParams();

  //Storing the data from database into store using setStore function
  const[store, setStore] = useState({});

  //Handling form stuff
  const[name, setName] = useState("");
  const[desc, setDesc] = useState("");
  const[image, setImage] = useState("");

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
    setImage(store.image || "");
  }, [id, store.storefront_name, store.storefront_description, store.image]);

  const saveChanges = async (e) => {
    try {
        const body = {
            name: name,
            description: desc,
            image: image
        };
        const response = await fetch(`http://localhost:3005/updateStore/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        console.log(response);
        navigate(`/yourstores/${1}`);
    }
    catch (err) {
        console.log(err)
    }
  };

  const goBack = () => {
    navigate(`/yourstores/${1}`);
  }

  return (
    <div>
      <h1 className='text-center mt-5'>Update StoreFront</h1>
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
      <label htmlFor='image'>Image:</label>
        <input type="text" className="form-control mt-2 mb-2" value={image}
        onChange={e => setImage(e.target.value)}/>
      </div>
      <div className="d-flex justify-content-between">
        <button className="btn btn-success mt-2" onClick={saveChanges}>Save Changes</button>
        <button className="btn btn-danger mt-2" onClick={goBack}>Go Back</button>
      </div>
    </div>
  )
}

export default StoreFrontUpdate;
