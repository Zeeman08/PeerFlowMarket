import React, { useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

const Product = () => {
  //Getting id from link
  const {id} = useParams();

  //Storing the data from database into store using setStore function
  const[product, setProduct] = useState({});

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

  return (
    <div>
        <h1>Product</h1>
        <h2>{product.product_name}</h2>
        <h2>{product.product_description}</h2>
        <h2>${product.price}</h2>
        <h2>{product.image}</h2>
    </div>
  )
}

export default Product;
