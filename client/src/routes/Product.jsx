import React, { useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Product = () => {
  //Getting id from link
  const {id} = useParams();

  //Storing the data from database into store using setStore function
  const[product, setProduct] = useState({});

  //Setting quantity
  const[quantity, setQuantity] = useState(0);
  
  //For going to other pages
  let navigate = useNavigate();

  //The useEffect hook that calls the getStore() function
  useEffect(() => {

    //The async function that fetches the data from the database
    const getProduct = async (e) => {
      try {
        const response = await fetch(`http://localhost:3005/getProduct/1/${id}`);
        const jsonData = await response.json();
        setProduct(jsonData.data.product);
        setQuantity(jsonData.data.product.quantity || 0);
        console.log("herelwer");
        console.log(jsonData.data.product.quantity);
        console.log(jsonData.data.product);
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
    const response = await fetch(`http://localhost:3005/addToCart/1/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: quantity
        })
      });
      const jsonData = await response.json();
      console.log(jsonData);
  };

  const reduceQuantity = async (e) => {
    if (quantity >= 1) {
      setQuantity(quantity - 1);
      const response0 = await fetch(`http://localhost:3005/removeFromCart/1/${id}`, {
          method: "DELETE",
          headers: {"Content-Type": "application/json"}
      });
      console.log(response0);
    }
  };

  const addToCart = async (id) => {
    try {
      
      navigate(`/store/${product.storefront_id}`);
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      {/* Image */}
      <div className="mt-4 d-flex justify-content-evenly">
        <h1>{product.image}</h1>
      </div>

      {/* Product Info */}
      <div>
        <div className="mt-3">
          <span className="fs-3">{product.product_name}</span>
          <h1 className="mt-4 text-decoration-underline">Details</h1>
        </div>
        <p className="fs-4 mt-3">
          {product.product_description}
        </p>
        <div>
          <h6 className="customtxt mt-5">${product.price}</h6>
        </div>
        <div>
          <div className="input-group mt-3">
            <button className="btn btn-primary" type="button" onClick={reduceQuantity}>-</button>
            <span className="input-group-text">{quantity}</span>
            <button className="btn btn-primary" type="button" onClick={addQuantity}>+</button>
          </div>
          <button className="btn btn-success mt-4" onClick={() => addToCart(id)}>Add to Cart</button>
        </div>
      </div>
    </div>
  )
}

export default Product;
