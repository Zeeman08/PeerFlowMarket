import React, { Fragment, useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';

const Home = () => {
  //Storing data for search bar
  const [searchText, setSearchText] = useState("");

  //Storing data for users for the table
  //Original data
  const[users, setUsers] = useState([]);
  //Buffer data used on table
  const[displayUsers, setDisplay] = useState([]);

  //For going to other pages
  let navigate = useNavigate();

  //The useEffect hook that calls the getUsers() function
  useEffect(() => {

    //The async function that fetches the data from the database
    const getUsers = async () => {
      try {
        const response = await fetch("http://localhost:3005/getPeople");
        const jsonData = await response.json();
        //console.log(jsonData);
        setUsers(jsonData.data.people);
        setDisplay(jsonData.data.people);
      }
      catch (err) {
        console.log(err);
      }
    };
    
    getUsers();
  }, []);


  /********************/
  /* SEARCH BAR STUFF */
  /********************/


  //On pressing search bar, it will search for the description
  const onSearch = async (e) => {
    e.preventDefault();
    setDisplay(users.filter(user => user.name.includes(searchText)));
  };


  /********************/
  /**** TABLE STUFF ***/
  /********************/

  //The async function that deletes the data from the database
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:3005/deletePeople/${id}`, {
        method: "DELETE"
      });

      //Resetting data in users by removing or not keep any users that have the same id as the one deleted
      //!= means value not equal, !== means value and type not equal
      //JS just prefers !== over !=
      setUsers(users.filter(user => user.id !== id));
      setDisplay(displayUsers.filter(user => user.id !== id));
      console.log(response);
    }
    catch (err) {
      console.log(err);
    }
  };

  //The function that takes you to the update page
  const updateUser = (id) => {
    try{
      //Go to 
      navigate(`/user/${id}/update`);
    }
    catch (err) {
      console.log(err);
    }
  };


  return (
    <div>
      {/* header */}
      <Fragment>
        <h1 className = "font-weight-light display-1 text-center mt-5">
          Peer Flow Market
        </h1>
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
              <th scope="col">UserID</th>
              <th scope="col">UserName</th>
              <th scope="col">Update</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {/* Storing table data format
            <tr>
              <td>3</td>
              <td>John</td>
              <td><button className="btn btn-warning">Update</button></td>
              <td><button className="btn btn-danger">Delete</button></td>
            </tr>
            */}
            {displayUsers.map (user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td><button className="btn btn-warning" onClick={() => updateUser(user.id)}>Update</button></td>
                <td><button className="btn btn-danger" onClick={() => deleteUser(user.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    </div>
  )
}

export default Home;

