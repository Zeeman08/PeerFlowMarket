
import React, { useState, useEffect } from 'react';
import { useData } from '../context/PersonContext';

const ViewCart = () => {
    // Getting id from link
    const { person } = useData();

    const [products, setProducts] = useState([]);
    // Buffer data used on table
    const [displayProducts, setDisplay] = useState([]);
    const [total, setTotal] = useState(0);

    // The useEffect hook that calls the getProducts() function
    useEffect(() => {
        const getProducts = async () => {
            try {
                // a while loop to wait until person is non null
                // while (!person || !person.person_id) {
                //     await new Promise(resolve => setTimeout(resolve, 1000));        // make sure this is ok
                // }
                const response = await fetch(`http://localhost:3005/getCart/${person.person_id}`);
                const jsonData = await response.json();
                setProducts(jsonData.data.cart);
                setDisplay(jsonData.data.cart);
                //update total
                let x = 0;
                jsonData.data.cart.forEach(product => {
                    x += product.price * product.quantity;
                });
                setTotal(x);
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
            setProducts(jsonData.data.cart);
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
            setProducts(jsonData.data.cart);
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
            setProducts(jsonData.data.cart);
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
      <button onClick={() => clearCart()}>Clear the cart</button>

      <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black' }}>Name</th>
            <th style={{ border: '1px solid black' }}>Product_ID</th>
            <th style={{ border: '1px solid black' }}>Description</th>
            <th style={{ border: '1px solid black' }}>Price</th>
            <th style={{ border: '1px solid black' }}>Quantity</th>
            <th style={{ border: '1px solid black' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayProducts.map(product => (
            <tr key={product.product_id} style={{ border: '1px solid black' }}>
              <td style={{ border: '1px solid black' }}>{product.product_name}</td>
              <td style={{ border: '1px solid black' }}>{product.product_id}</td>
              <td style={{ border: '1px solid black' }}>{product.product_description}</td>
              <td style={{ border: '1px solid black' }}>{product.price}</td>
              <td style={{ border: '1px solid black' }}>{product.quantity}</td>
              <td style={{ border: '1px solid black' }}>
                <button onClick={() => handleDecreaseCount(product.product_id)}>-</button>
                <button onClick={() => handleIncreaseCount(product.product_id, product.quantity)}>+</button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="2" style={{ border: '1px solid black' }}></td>
            <td style={{ border: '1px solid black' }}>Total:</td>
            <td style={{ border: '1px solid black' }}>{total.toFixed(2)}</td>
            <td style={{ border: '1px solid black' }}></td>
          </tr>
        </tbody>
      </table>
    </div>
    );
};

export default ViewCart;
