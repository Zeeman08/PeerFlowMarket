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
    <Fragment>
      //display the user id and name
      <h1 className='text-center mt-5'>User {id} {name}</h1>
    </Fragment>
  )
}

export default User;
