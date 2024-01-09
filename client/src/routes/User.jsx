import React, {Fragment, useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

const User = () => {
  //Getting id from link
  const {id} = useParams();

  //Handling form stuff
  const[name, setName] = useState("");

  //Storing the data from database into user using setUser function
  const[user, setUser] = useState([]);

  //For going back to home page
  let navigate = useNavigate();


  //The useEffect hook that calls the getUser() function
  useEffect(() => {

    //The async function that fetches the data from the database
    const getUser = async () => {
      try {
        const response = await fetch(`http://localhost:3005/getPeople/${id}`);
        const jsonData = await response.json();
        //console.log(jsonData);
        setUser(jsonData.data.people);
      }
      catch (err) {
        console.log(err);
      }
    };

    //Being called
    setName(user.name);
    getUser();
  }, [id, user.name]);



  return (
      //show the user name and user id in two rows of a table, use bootstrap
      //bring the table down a bit

      <div className="container" style={{ marginTop: '100px' }}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">User ID</th>
              <th scope="col">User Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{user.id}</td>
              <td>{user.name}</td>
            </tr>
          </tbody>
        </table>
    </div>
  )
}

export default User;
