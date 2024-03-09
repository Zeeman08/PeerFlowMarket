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

  //console.log(person);

  //Buffer data used on table
  const[displayStores, setDisplay] = useState([]);


  

  /*******************/
  /* DROP DOWN STUFF */
  /*******************/

  const [isActive, setIsActive] = useState(false);
  const [selected, setSelected] = useState({category_name: "All"});
  const [options, setOptions] = useState([]);

  /*******************/
  /* FOR PAGINATION  */
  /*******************/
  const [currentPage, setCurrentPage] = useState(1);
  const [storesPerPage, setStoresPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const[searchTrigger, setSearchTrigger] = useState(0);

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
        const response = await fetch(`http://localhost:3005/getStoresManagedByPerson/${person.person_id}?rows_per_page=${storesPerPage}&page_number=${currentPage}&search=${searchText}&category=${selected.category_name}`);
        const jsonData = await response.json();
        setStores(jsonData.data.stores);
        setDisplay(jsonData.data.stores);
        setTotalPages(jsonData.data.totalPages);
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

      } catch (error) {
        console.log(error);
      }
    }
    
    getStores();
    getCat();
  }, [person, currentPage, storesPerPage, searchTrigger]);


  // Handle pagination button click
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  // Handle rows per page change
  const handleRowsPerPageChange = (e) => {
    setStoresPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when changing rows per page
  };

  /********************/
  /* SEARCH BAR STUFF */
  /********************/


  //On pressing search bar, it will search for the description
  const onSearchName = async (e) => {
    e.preventDefault();
    console.log("searching");
    setSearchTrigger(1-searchTrigger);
    // e.preventDefault();
    // if (selected.category_name !== "All"){
    //   setDisplay(stores.filter(store => store.storefront_name.toLowerCase().includes(searchText.toLowerCase()) && store.category === selected.category_name));
    // }
    // else{
    //   setDisplay(stores.filter(store => store.storefront_name.toLowerCase().includes(searchText.toLowerCase())));
    // }
  };



  /********************/
  /**** TABLE STUFF ***/
  /********************/

  //The async function that deletes the data from the database
  const deleteStore = async (id) => {
    try {
      const body = {person_id: person.person_id};
      const response = await fetch(`http://localhost:3005/deleteStore/${id}/${person.person_id}`, {
        method: "DELETE",
        body: JSON.stringify(body)
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
          <button className="resetbtn btn btn-outline-danger" onClick={e => {setSelected({category_name: "All"})}}>Reset Categories</button>

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

        {/* Rows per page dropdown */}
        <div className='mb-5' style={{ textAlign: 'center', marginTop: '1rem' }}>
          <label htmlFor="rowsPerPage" style={{ marginRight: '0.5rem' }}>Rows per page:</label>
          <select id="rowsPerPage" value={storesPerPage} onChange={handleRowsPerPageChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
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
                  <td>
                    <img
                    src={require(`../images/${store.image?store.image:"avatar.png"}`)}
                    alt="../images/avatar.png"
                    style={{ width: '40%', height: 'auto', alignSelf: 'center'}}
                    />
                      
                  </td>
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

        {/* Pagination */}
        <div style={{ paddingBottom: '60px', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            style={{ padding: '0.5rem', marginRight: '1rem', cursor: 'pointer', backgroundColor: '#007BFF', color: 'white' }}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          <span className="mt-2" style={{ fontSize: '1rem', marginRight: '1rem' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            style={{ padding: '0.5rem', cursor: 'pointer', backgroundColor: '#007BFF', color: 'white' }}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default YourStores;