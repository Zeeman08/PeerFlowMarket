import React, {Fragment, useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

const StoreFront = () => {
  //Getting id from link
  const {id} = useParams();

  //Storing the data from database into store using setStore function
  const[store, setStore] = useState({});

  //Storing data for search bar
  const [searchText, setSearchText] = useState("");

  //Storing data for products for the table
  //Original data
  const[products, setProducts] = useState([]);
  //Buffer data used on table
  const[displayProducts, setDisplay] = useState([]);

  //For going to other pages
  let navigate = useNavigate();

  //The useEffect hook that calls the getStore() function
  useEffect(() => {

    //The async function that fetches the data from the database
    const getStore = async () => {
      try {
        const response = await fetch(`http://localhost:3005/getStore/${id}`);
        const jsonData = await response.json();
        setStore(jsonData.data.stores);
      }
      catch (err) {
        console.log(err);
      }
    };

    const getProducts = async () => {
      try{
        const response = await fetch(`http://localhost:3005/getStoreProducts/${id}`);
        const jsonData = await response.json();
        setProducts(jsonData.data.products);
        setDisplay(jsonData.data.products);
      }
      catch (err) {
        console.log(err);
      }
    }

    //Being called
    getStore();
    getProducts();
  }, [id]);

  products.forEach(product => {
    if (product.rating_count === 0) product.rating_count = 1;
  });
  displayProducts.forEach(product => {
    if (product.rating_count === 0) product.rating_count = 1;
  });



  /********************/
  /* SEARCH BAR STUFF */
  /********************/


  //On pressing search bar, it will search for the description
  const onSearch = async (e) => {
    e.preventDefault();
    setDisplay(products.filter(product => product.product_name.includes(searchText)));
  };



  /********************/
  /**** TABLE STUFF ***/
  /********************/

  //The async function that deletes the data from the database
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:3005/deleteProduct/${id}`, {
        method: "DELETE"
      });

      //Resetting data in stores by removing or not keep any stores that have the same id as the one deleted
      //!= means value not equal, !== means value and type not equal
      //JS just prefers !== over !=
      setProducts(products.filter(product => product.product_id !== id));
      setDisplay(displayProducts.filter(product => product.product_id !== id));
      console.log(response);
    }
    catch (err) {
      console.log(err);
    }
  };

  //The function that takes you to the update page
  // const updateProduct = (id) => {
  //   try{
  //     //Go to
  //     navigate(`/product/${id}/update`);
  //   }
  //   catch (err) {
  //     console.log(err);
  //   }
  // };

  //This function triggers when you double click a store row
  // const visitProduct = (e, id) => {
  //   if (e.detail > 1){
  //     navigate(`/product/${id}`)
  //   }
  // }

  const goBack = () => {
    navigate("/");
  }

  return (
    <div>
      {/* header */}
      <Fragment>
        <h1 className='text-center mt-5'>{store.name}</h1>
      </Fragment>


    {/* search bar */}
      <Fragment>
        <form className="d-flex mt-4 mb-4" onSubmit={onSearch}>
            <input type="text" className="form-control" value={searchText} 
            onChange={e => setSearchText(e.target.value)}/>
            <button className="btn btn-outline-secondary">Search</button>
        </form>
      </Fragment>

      {/* table */}
      <Fragment>
        <table className="table table-hover table-secondary table-striped table-bordered text-center">
          <thead className="table-dark">
            <tr className="bg-primary">
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Price</th>
              <th scope="col">Rating</th>
              <th scope="col">Update</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {displayProducts.map (product => (
              <tr key={product.product_id} onClick={() => console.log("View Product")}>
                <td>{product.product_name}</td>
                <td>{product.product_description}</td>
                <td>{product.price}</td>
                <td>{product.rating_sum / product.rating_count}</td>
                <td><button className="btn btn-warning" onClick={() => console.log("Update")}>Update</button></td>
                <td><button className="btn btn-danger" onClick={() => deleteProduct(product.product_id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-danger" onClick={goBack}>Go Back</button>
      </Fragment>
    </div>
  )
}

export default StoreFront