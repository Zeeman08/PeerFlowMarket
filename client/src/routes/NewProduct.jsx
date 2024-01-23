import React, { useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';

const NewProduct = () => {
  //Getting id from link
  const {id} = useParams();

  //Handling form stuff
  const[name, setName] = useState("new product");
  const[desc, setDesc] = useState("new description");
  const[image, setImage] = useState("image.jpg");
  const[price, setPrice] = useState(0);
  const[tags, setTags] = useState("");

  //For going back to home page
  let navigate = useNavigate();

  const saveChanges = async (e) => {
    try {
        const body = {
            name: name,
            description: desc,
            price: price,
            image: image,
            tags: tags
        };
        const response = await fetch(`http://localhost:3005/createProduct/${id}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        console.log(response);
        navigate(`/yourstore/${id}`);
    }
    catch (err) {
        console.log(err)
    }
  };

  const goBack = () => {
    navigate(`/yourstore/${id}`);
  }

  return (
    <div>
      <h1 className='text-center mt-5'>New Product</h1>
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
      <div>
      <label htmlFor='Price'>Price:</label>
        <input type="number" className="form-control mt-2 mb-2" value={price}
        onChange={e => setPrice(e.target.value)}/>
      </div>
      <div>
      <label htmlFor='tags'>Tags:</label>
        <input type="text" className="form-control mt-2 mb-2" value={tags}
        onChange={e => setTags(e.target.value)}/>
      </div>
      <div className="d-flex justify-content-between">
        <button className="btn btn-success mt-2" onClick={saveChanges}>Save Changes</button>
        <button className="btn btn-danger mt-2" onClick={goBack}>Go Back</button>
      </div>
    </div>
  )
}

export default NewProduct;
