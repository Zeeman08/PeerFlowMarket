import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import {useData} from '../context/PersonContext';

const NewStore = () => {
  //Getting id from link
  const {person} = useData();

  //Handling form stuff
  const[name, setName] = useState("new store");
  const[category, setCat] = useState("Hardware");
  const[desc, setDesc] = useState("new description");
  const[image, setImage] = useState("image.jpg");

  //For going back to home page
  let navigate = useNavigate();

  /*************************/
  /**** ADD STORE STUFF ****/
  /*************************/

  const saveChanges = async (e) => {
    try {
        const body = {
            name: name,
            category: category,
            description: desc,
            image: image,
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
        <input type="text" className="form-control mt-2 mb-2" value={category}
        onChange={e => setCat(e.target.value)}/>
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

export default NewStore;