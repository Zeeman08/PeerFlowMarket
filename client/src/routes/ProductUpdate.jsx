import React, { useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

const ProductUpdate = () => {
  //Getting id from link
  const {id} = useParams();

  //Storing the data from database into store using setStore function
  const[product, setProduct] = useState({});

  //Handling form stuff
  const[name, setName] = useState("");
  const[desc, setDesc] = useState("");
  const[image, setImage] = useState("");
  const[price, setPrice] = useState(0);
  const[tags, setTags] = useState("");

  //For going back to home page
  let navigate = useNavigate();


  //The useEffect hook that calls the getStore() function
  useEffect(() => {

    //The async function that fetches the data from the database
    const getProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3005/getProduct/${id}`);
        const jsonData = await response.json();
        //console.log(jsonData);
        setProduct(jsonData.data.product);
      }
      catch (err) {
        console.log(err);
      }
    };

    //Being called
    getProduct();
    console.log(product);
    setName(product.product_name || "");
    setDesc(product.product_description || "");
    setImage(product.image || "");
    setPrice(product.price || 0);
    setTags(product.tags || "");
  }, [id, product, product.product_name, product.product_description, product.image, product.price, product.tags]);

  const saveChanges = async (e) => {
    try {
        const body = {
            name: name,
            description: desc,
            price: price,
            image: image,
            tags: tags
        };
        const response = await fetch(`http://localhost:3005/updateProduct/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        console.log(response);
        navigate(`/yourstore/${product.storefront_id}`);
    }
    catch (err) {
        console.log(err)
    }
  };

  const goBack = () => {
    navigate(`/yourstore/${product.storefront_id}`);
  }

  return (
    <div>
      <h1 className='text-center mt-5'>Update Product</h1>
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

export default ProductUpdate;
