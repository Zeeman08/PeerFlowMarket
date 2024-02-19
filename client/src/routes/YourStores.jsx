import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import {useData} from '../context/PersonContext';
import '../stylesheet.css';

const YourStores = () => {
  //Storing data for search bars
  const [searchText, setSearchText] = useState("");

  //Storing data for stores for the table
  //Original data
  const[stores, setStores] = useState([]);

  //Getting data from context
  const {person} = useData();

  console.log(person);

  //console.log(person);

  //Buffer data used on table
  const[displayStores, setDisplay] = useState([]);

  /*******************/
  /* DROP DOWN STUFF */
  /*******************/

  const [isActive, setIsActive] = useState(false);
  const [selected, setSelected] = useState({category_name: "Select a category"});
  const [options, setOptions] = useState([]);

  //For going to other pages
  let navigate = useNavigate();

  //The useEffect hook that calls the getStores() function
  useEffect(() => {

    //The async function that fetches the data from the database
    const getStores = async () => {
      try {
        if (person === undefined){
          console.log("person is undefined");
        }
        const response = await fetch(`http://localhost:3005/getStoresManagedByPerson/${person.person_id}`);
        const jsonData = await response.json();
        console.log(jsonData.data.stores);
        setStores(jsonData.data.stores);
        setDisplay(jsonData.data.stores);
      }
      catch (err) {
        console.log(err);
      }
    };

    //The async function that fetches available categories
    const getCat = async () => {
      try {
        const response = await fetch("http://localhost:3005/getCategories");
        const jsonData = await response.json();
        setOptions(jsonData.data.categories);

        console.log(options);

      } catch (error) {
        console.log(error);
      }
    }
    
    getStores();
    getCat();
  }, [person]);


  /********************/
  /* SEARCH BAR STUFF */
  /********************/


  //On pressing search bar, it will search for the description
  const onSearchName = async (e) => {
    e.preventDefault();
    if (selected.category_name !== "Select a category"){
      setDisplay(stores.filter(store => store.storefront_name.toLowerCase().includes(searchText.toLowerCase()) && store.category === selected.category_name));
    }
    else{
      setDisplay(stores.filter(store => store.storefront_name.toLowerCase().includes(searchText.toLowerCase())));
    }
  };



  /********************/
  /**** TABLE STUFF ***/
  /********************/

  //The async function that deletes the data from the database
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
  

  //This function triggers when you double click a store row
  const visitStore = (e, id) => {
    if (e.detail > 1){
      navigate(`/yourstore/${id}`)
    }
  }

  return (
    <div className="container">
      <div>
        {/* header */}
        <div>
          <h1 className = "font-weight-light display-1 text-center mt-4">
            Your Stores
          </h1>
        </div>


        {/* search bar */}
        <div>
          <h6 className="text-center mt-4 fs-4">Search by name</h6>
          <form className="d-flex mt-4 mb-4" onSubmit={onSearchName}>
              <input type="text" className="form-control" value={searchText} 
              onChange={e => setSearchText(e.target.value)}/>
              <button className="btn btn-outline-secondary">Search</button>
          </form>

            {/* new store button */}
            <div>
                <button className="btn btn-success mb-4" onClick={() => navigate(`/newstore`)}>New Store</button>
            </div>
            <button className="resetbtn btn btn-outline-danger" onClick={e => {setSelected({category_name: "Select a category"})}}>Reset Categories</button>

          {/* drop down */}
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
        </div>
        

        {/* table */}
        <div>
          <table className="table table-hover table-secondary table-striped table-bordered text-center">
            <thead className="table-dark">
              <tr className="bg-primary">
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Description</th>
                <th scope="col">Rating</th>
                <th scope="col">Update</th>
                <th scope="col">Delete</th> 
              </tr>
            </thead>
            <tbody>
              {displayStores.map (store => (
                <tr key={store.storefront_id} onClick={(e) => visitStore(e, store.storefront_id)}>
                  <td>{store.image}</td>
                  <td>{store.storefront_name}</td>
                  <td>{store.category}</td>
                  <td>{store.storefront_description}</td>
                  <td>{store.rating}</td>
                  <td><button className="btn btn-warning" onClick={() => updateStore(store.storefront_id)}>Update</button></td>
                  <td><button className="btn btn-danger" onClick={() => deleteStore(store.storefront_id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default YourStores;