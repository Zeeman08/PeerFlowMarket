
import React, { useState, useEffect } from 'react';
import { useData } from '../context/PersonContext';
import { useNavigate} from 'react-router-dom';
import './dropdown.css';
const ViewCart = () => {
    // Getting id from link
    const { person } = useData();

    // Buffer data used on table
    const [displayProducts, setDisplay] = useState([]);
    const [total, setTotal] = useState(0);

    /*******************/
    /* DROP DOWN STUFF */
    /*******************/

    const [isActive, setIsActive] = useState(false);
    const [selected, setSelected] = useState({category_name: "Payment Method"});
    const [options, setOptions] = useState([]);

    let navigate = useNavigate();
    // The useEffect hook that calls the getProducts() function
    useEffect(() => {
        const getProducts = async () => {
            try {
                // a while loop to wait until person is non null
                // while (!person || !person.person_id) {
                //     await new Promise(resolve => setTimeout(resolve, 1000));        // make sure this is ok
                // }
                if (person.person_id === undefined) return;
                const response = await fetch(`http://localhost:3005/getCart/${person.person_id}`);
                const jsonData = await response.json();
                setDisplay(jsonData.data.cart);
                //update total
                let x = 0;
                jsonData.data.cart.forEach(product => {
                    x += product.price * product.quantity;
                });
                setTotal(x);
                setOptions([
                    {category_name: "Bkash"},
                    {category_name: "Nagad"},
                    {category_name: "Cash On Delivery"}
                ]);
            } catch (err) {
                console.log(err);
            }
        };

        // Being called
        getProducts();
    }, [person]);
    const handleIncreaseCount = async (product_id, quantity) => {
        try {
            //await fetch(`http://localhost:3005/addToCart/${id}/${product_id}`);
            const response = await fetch(`http://localhost:3005/addToCart/${person.person_id}/${product_id}/${1}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  quantity: quantity
                })
              });
            const response2 = await fetch(`http://localhost:3005/getCart/${person.person_id}`);
            const jsonData = await response2.json();
            setDisplay(jsonData.data.cart);
            let x = 0;
                jsonData.data.cart.forEach(product => {
                    x += product.price * product.quantity;
                });
                setTotal(x);
        } catch (err) {
            console.log(err);
        }
    }
    const handleDecreaseCount = async (product_id) => {
        try {
            //await fetch(`http://localhost:3005/removeFromCart/${id}/${product_id}`);
            const response0 = await fetch(`http://localhost:3005/removeFromCart/${person.person_id}/${product_id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"}
            });
            const response = await fetch(`http://localhost:3005/getCart/${person.person_id}`);
            const jsonData = await response.json();
            setDisplay(jsonData.data.cart);
            let x = 0;
                jsonData.data.cart.forEach(product => {
                    x += product.price * product.quantity;
                });
                setTotal(x);
        } catch (err) {
            console.log(err);
        }
    }
    const checkout = async() => {
      if(selected.category_name === "Payment Method"){
        alert("Please select a payment method");
        return;
      }
      if(total === 0){
        alert("Your cart is empty");
        return;
      }
      console.log("high");
      console.log(selected);
      const response = await fetch(`http://localhost:3005/checkout/${person.person_id}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          payment_method: selected.category_name
        })
      });
      
      navigate("/stores");
    }
    
    const clearCart = async () => {
        console.log("high");
        //return;
        try {
            //await fetch(`http://localhost:3005/removeFromCart/${id}/${product_id}`);
            const response0 = await fetch(`http://localhost:3005/clearCart/${person.person_id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"}
            });
            console.log(response0);
            const response = await fetch(`http://localhost:3005/getCart/${person.person_id}`);
            const jsonData = await response.json();
            setDisplay(jsonData.data.cart);
            console.log(jsonData);
            console.log(jsonData.data.cart);
            setTotal(0);
        } catch (err) {
            console.log(err);
        }
        }
    return (
    <div>
      <h1 className = "font-weight-light display-1 text-center mt-4">Your Cart</h1>
      <div className="d-flex justify-content-between">
        <button className="btn btn-danger mt-4" onClick={() => clearCart()}>Clear the cart</button>
        
      </div>
      
      <table className="table table-hover table-secondary table-striped table-bordered text-center mt-4">
        <thead className="table-dark">
          <tr className="bg-primary">
            <th scope="col">Name</th>
            <th scope="col">Product_ID</th>
            <th scope="col">Description</th>
            <th scope="col">Price</th>
            <th scope="col">Quantity</th>
            <th scope="col-3">Add</th>
            <th scope="col-3">Remove</th>
          </tr>
        </thead>
        <tbody>
          {displayProducts.map(product => (
            <tr key={product.product_id}>
              <td>{product.product_name}</td>
              <td>{product.product_id}</td>
              <td>{product.product_description}</td>
              <td>${product.price}</td>
              <td>{product.quantity}</td>
              <td>
                <button className="btn btn-success" onClick={() => handleIncreaseCount(product.product_id, product.quantity)}>+</button>
              </td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDecreaseCount(product.product_id)}>-</button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="2"></td>
            <td>Total:</td>
            <td>${total.toFixed(2)}</td>
            <td></td>
            <td colSpan="2"></td>
          </tr>
        </tbody>
      </table>

      <div className="dropdown">
        <div className="dropdown-btn" onClick={e => setIsActive(!isActive)}>
          {selected.category_name}
          <span className="fas fa-caret-down"></span>
        </div>
        {isActive && (
          <div className="dropdown-content">
            {options.map(option => (
              <div key={option.category_name} className="dropdown-item" onClick={e => {
                setSelected(option);
                setIsActive(false);
              }}>{option.category_name}</div>
            ))}
          </div>
        )}
      </div>
      <button className="btn btn-success mt-4" onClick={() => checkout()} style={{ display: 'block', margin: 'auto' }}>Checkout</button>

    </div>
    );
};

export default ViewCart;
