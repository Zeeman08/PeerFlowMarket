import React, { useState, useEffect } from 'react'
import {useData} from '../context/PersonContext';

const Home = ({setAuth}) => {
  
  const [name, setName] = useState("");

  const {person, setPerson} = useData();

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
  };

  useEffect(() => {
    const getDetails = async () => {
      try {
          const response = await fetch("http://localhost:3005/dashboard/", {
              method: "GET",
              headers: {token: localStorage.token}
          });
  
          const parseRes = await response.json();
          setPerson(parseRes);

          setName(person.person_name);
      } catch (error) {
          console.log(error);
      }
    };

    getDetails();
  }, [setPerson, person.person_name]);

  return (
    <div>
      <h1 className="text-center my-5">Welcome {name}</h1>
      <button className="btn btn-primary" onClick={e => logout(e)}>Logout</button>
    </div>
  )
}

export default Home;
