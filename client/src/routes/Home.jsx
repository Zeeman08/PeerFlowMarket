import React, { useEffect } from 'react'
import {useData} from '../context/PersonContext';
import './home.css';

const Home = ({setAuth}) => {

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
      } catch (error) {
          console.log(error);
      }
    };

    getDetails();
  }, [setPerson]);

  if (!person){
    return <div><h1>Loading...</h1></div>
  }

  return (
    <div className="mt-5 profile-card">
      <div className="profile-header">
        <h1 className="profile-title">Personal Information</h1>
      </div>
      <div className="profile-body">
        <div className="profile-picture">
          <img src={person.image ? require('../images/' + person.image) : require('../images/avatar.png')} alt="Profile" className="profile-image" />
        </div>
        <div className="profile-details">
          <div className="profile-item">
            <label htmlFor="name" className="profile-label">Name:</label>
            <div className="profile-value">{person.person_name}</div>
          </div>
          <div className="profile-item">
            <label htmlFor="id" className="profile-label">ID:</label>
            <div className="profile-value">{person.person_id}</div>
          </div>
          <div className="profile-item">
            <label htmlFor="dateOfBirth" className="profile-label">Date of Birth:</label>
            <div className="profile-value">{person.date_of_birth}</div>
          </div>
          <div className="profile-item">
            <label htmlFor="phone" className="profile-label">Phone:</label>
            <div className="profile-value">{person.phone}</div>
          </div>
          <div className="profile-item">
            <label htmlFor="email" className="profile-label">Email:</label>
            <div className="profile-value">{person.email}</div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between profile-footer">
        <div>
          <button className="btn btn-primary profile-button" onClick={e => logout(e)}>Logout</button>
        </div>
        <div>
          <button className="btn btn-warning profile-button">Update</button>
          <button className="btn btn-danger profile-button">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default Home;
