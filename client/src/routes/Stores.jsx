import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import '../stylesheet.css';

const Stores = () => {
  //Storing data for search bar
  const [searchText, setSearchText] = useState("");

  //Storing data for stores for the table
  //Original data
  const[stores, setStores] = useState([]);
  //Buffer data used on table
  const[displayStores, setDisplay] = useState([]);

  //Storing data for add storefront bar
  const [storeName, setStoreName] = useState("");
  const [storeDesc, setStoreDesc] = useState("");
  const [storeImage, setStoreImage] = useState("");

  //For going to other pages
  let navigate = useNavigate();

  //The useEffect hook that calls the getStores() function
  useEffect(() => {

    //The async function that fetches the data from the database
    const getStores = async () => {
      try {
        const response = await fetch("http://localhost:3005/getStores");
        const jsonData = await response.json();
        setStores(jsonData.data.stores);
        setDisplay(jsonData.data.stores);
      }
      catch (err) {
        console.log(err);
      }
    };
    
    getStores();
  }, []);


  /********************/
  /* SEARCH BAR STUFF */
  /********************/


  //On pressing search bar, it will search for the description
  const onSearch = async (e) => {
    e.preventDefault();
    setDisplay(stores.filter(store => store.storefront_name.includes(searchText)));
  };


  /********************/
  /**** TABLE STUFF ***/
  /********************/

  //The async function that deletes the data from the database
  /*
  const deleteStore = async (id) => {
    try {
      const response = await fetch(`http://localhost:3005/deleteStore/${id}`, {
        method: "DELETE"
      });

      //Resetting data in stores by removing or not keep any stores that have the same id as the one deleted
      //!= means value not equal, !== means value and type not equal
      //JS just prefers !== over !=
      setStores(stores.filter(store => store.storefront_id !== id));
      setDisplay(displayStores.filter(store => store.storefront_id !== id));
      console.log(response);
    }
    catch (err) {
      console.log(err);
    }
  };

  //The function that takes you to the update page
  const updateStore = (id) => {
    try{
      //Go to
      navigate(`/store/${id}/update`);
    }
    catch (err) {
      console.log(err);
    }
  };
  */

  //This function triggers when you double click a store row
  const visitStore = (e, id) => {
    if (e.detail > 1){
      navigate(`/store/${id}`)
    }
  }


  /*************************/
  /**** ADD STORE STUFF ****/
  /*************************/

  const addStoreFront = async (e) => {
    try {
      e.preventDefault();
      const body = {
        name: storeName,
        description: storeDesc,
        image: storeImage
      };
      const response = await fetch("http://localhost:3005/createStore", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(body)
      });

      console.log(response);

      //Refresh page
      window.location.reload();
    }
    catch (err) {
      console.log(err);
    }
  }


  return (
    <div>
      <div className="container">
        {/* header */}
        <div>
          <h1 className = "font-weight-light display-1 text-center mt-5">
            Peer Flow Market
          </h1>
        </div>


        {/* search bar */}
        <div>
          <form className="d-flex mt-4 mb-4" onSubmit={onSearch}>
              <input type="text" className="form-control" value={searchText} 
              onChange={e => setSearchText(e.target.value)}/>
              <button className="btn btn-outline-secondary">Search</button>
          </form>
        </div>



        {/* table */}
        <div>
          <table className="table table-hover table-secondary table-striped table-bordered text-center">
            <thead className="table-dark">
              <tr className="bg-primary">
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Rating</th>
                {/*
                <th scope="col">Update</th>
                <th scope="col">Delete</th>
                */}
              </tr>
            </thead>
            <tbody>
              {displayStores.map (store => (
                <tr key={store.storefront_id} onClick={(e) => visitStore(e, store.storefront_id)}>
                  <td>{store.storefront_name}</td>
                  <td>{store.storefront_description}</td>
                  <td>{store.rating}</td>
                  {/*
                  <td><button className="btn btn-warning" onClick={() => updateStore(store.storefront_id)}>Update</button></td>
                  <td><button className="btn btn-danger" onClick={() => deleteStore(store.storefront_id)}>Delete</button></td>
                  */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* add store button */}
        <div>
          <form className="d-flex mt-4" onSubmit={onSearch}>
              <input type="text" placeholder="Name" className="form-control" value={storeName} 
              onChange={e => setStoreName(e.target.value)}/>
              <input type="text" placeholder="Description" className="form-control" value={storeDesc} 
              onChange={e => setStoreDesc(e.target.value)}/>
              <input type="text" placeholder="Image" className="form-control" value={storeImage} 
              onChange={e => setStoreImage(e.target.value)}/>
              <button className="btn btn-primary" onClick={e => addStoreFront(e)}>+</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Stores;

