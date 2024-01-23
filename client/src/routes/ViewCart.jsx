
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewCart = () => {
console.log("Hello, world!");


    // Getting id from link
    const { id } = useParams();
    console.log(id);

    // Storing the data from database into store using setStore function
    const [store, setStore] = useState({});

    // Storing data for search bar
    const [searchText, setSearchText] = useState("");

    // Storing data for products for the table
    // Original data
    const [products, setProducts] = useState([]);
    // Buffer data used on table
    const [displayProducts, setDisplay] = useState([]);

    // For going to other pages
    let navigate = useNavigate();

    // The useEffect hook that calls the getStore() function
    useEffect(() => {


        const getProducts = async () => {
            try {
                const response = await fetch(`http://localhost:3005/getCart/${id}`);
                const jsonData = await response.json();
                setProducts(jsonData.data.products);
                setDisplay(jsonData.data.products);
            }
            catch (err) {
                console.log(err);
            }
        }

        // Being called
        getProducts();
    }, [id]);
    

    return (
        <div>
            <div>
                <h1>View Cart</h1>
                
            </div>
        </div>
    );
}

export default ViewCart;
