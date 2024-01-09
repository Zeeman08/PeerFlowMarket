import React, {Fragment, useState, useEffect} from 'react';
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

    setName(product.name || "");
    setDesc(product.description || "");
    setImage(product.image || "");
    setPrice(product.price || 0);
    setTags(product.tags || "");
  }, [id, product.name, product.description, product.image, product.price, product.tags]);

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
        navigate("/");
    }
    catch (err) {
        console.log(err)
    }
  };

  return (
    <Fragment>
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
      <button className="btn btn-success" onClick={saveChanges}>Save Changes</button>
    </Fragment>
  )
}

export default ProductUpdate;
