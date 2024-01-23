import React, { useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

const Product = () => {
  //Getting id from link
  const {id} = useParams();

  //Storing the data from database into store using setStore function
  const[product, setProduct] = useState({});

  //Setting quantity
  const[quantity, setQuantity] = useState(1);

  //The useEffect hook that calls the getStore() function
  useEffect(() => {

    //The async function that fetches the data from the database
    const getProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3005/getProduct/${id}`);
        const jsonData = await response.json();
        setProduct(jsonData.data.product);
      }
      catch (err) {
        console.log(err);
      }
    };

    //Being called
    getProduct();
  }, [id]);

  //On pressing + button
  const addQuantity = async (e) => {
    setQuantity(quantity + 1);
  };

  const reduceQuantity = async (e) => {
    if (quantity > 1)
      setQuantity(quantity - 1);
  };

  return (
    <div>
      {/* Image */}
      <div>
        <h1>{product.image}</h1>
      </div>

      {/* Product Info */}
      <div>
        <div className="mt-3">
          <span className="fs-3">{product.product_name}</span>
          <h1 className="mt-4">Details</h1>
        </div>
        <p className="fs-4">
          {product.product_description}
        </p>
        <div>
          <h6 className="customtxt">${product.price}</h6>
        </div>
        <div>
          <div className="input-group">
            <button className="btn btn-primary" type="button" onClick={reduceQuantity}>-</button>
            <span className="input-group-text">{quantity}</span>
            <button className="btn btn-primary" type="button" onClick={addQuantity}>+</button>
          </div>
          <button className="btn btn-success mt-3">Add to Cart</button>
        </div>
      </div>
    </div>
  )
}

export default Product;
