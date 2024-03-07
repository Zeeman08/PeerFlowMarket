import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/PersonContext';

const Product = () => {
  const { id } = useParams();
  const { person } = useData();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  let navigate = useNavigate();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3005/getProduct/${id}`);
        const jsonData = await response.json();
        setProduct(jsonData.data.product);
      } catch (err) {
        console.log(err);
      }
    };

    getProduct();
  }, []);

  const addQuantity = () => {
    if (product.stock_count > quantity) setQuantity(quantity + 1);
  };

  const reduceQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const addToCart = async (id) => {
    try {
      const response = await fetch(`http://localhost:3005/addToCart/${person.person_id}/${id}/${quantity}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: quantity,
        }),
      });
      const jsonData = await response.json();
      if (!jsonData.data.stat) {
        alert("Failed to add to cart, not enough in stock!");
        navigate(`/product/${product.product_id}`);
        return;
      }
      navigate(`/store/${product.storefront_id}`);
    } catch (err) {
      console.log(err);
    }
  };

  const leaveReview = () => {
    navigate(`/leaveReview/${id}`);
  };

  const seeReviews = () => {
    navigate(`/seeReview/${id}`);
  };

  return (
    <div className="d-flex mt-4">
      {/* Product Image */}
      <div className="me-4">
        {product.image && (
          <img
            src={require(`../images/${product.image}`)}
            alt="Product Image"
            style={{ width: '100%', height: 'auto' }}
          />
        )}
      </div>

      {/* Product Info */}
      <div>
        <div className="mt-3">
          <span className="fs-3">{product.product_name}</span>
          <h1 className="mt-4 text-decoration-underline">Details</h1>
        </div>
        <p className="fs-4 mt-3">{product.product_description}</p>
        <p className="fs-4 mt-3">In stock: {product.stock_count}</p>
        <div>
          <h6 className="customtxt mt-5">${product.price}</h6>
        </div>
        <div>
          <div className="input-group mt-3">
            <button className="btn btn-primary" type="button" onClick={reduceQuantity}>
              -
            </button>
            <span className="input-group-text">{quantity}</span>
            <button className="btn btn-primary" type="button" onClick={addQuantity}>
              +
            </button>
          </div>
          <div>
            <button className="btn btn-success mt-4" onClick={() => addToCart(id)}>
              Add to Cart
            </button>
          </div>
          <div>
            <button className="btn btn-success mt-4" onClick={() => leaveReview(id)}>
              Leave a review!
            </button>
          </div>
          <div>
            <button className="btn btn-success mt-4" onClick={() => seeReviews()}>
              Reviews for this product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
