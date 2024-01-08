import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

const UserUpdate = () => {
  //Getting id from link
  const {id} = useParams();

  //Storing the data from database into user using setUser function
  const[user, setUser] = useState([]);

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
    getUser();
  }, [id]);

  console.log(user.name);

  return (
    <div>
      <h1 className='text-center mt-5'>UserUpdate</h1>
    </div>
  )
}

export default UserUpdate;
