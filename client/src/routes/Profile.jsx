import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import {useData} from '../context/PersonContext';
import './profile.css';

const Dashboard = ({setAuth}) => {

  const {person, setPerson} = useData();

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
  };

  let navigate = useNavigate();

  const updateProfile = () => {
    navigate('/updateProfile');
  };

  const deleteProfile = async (e) => {
    const confirmed = window.confirm("Are you sure you want to delete your profile? This action cannot be undone, and all data will be lost.");
    if (confirmed) {
      try {
        // Send fetch request to delete the person
        const response = await fetch(`http://localhost:3005/deletePerson/${person.person_id}`, {
          method: "DELETE",
          headers: { token: localStorage.token }
        });
  
        if (response.ok) {
          // If deletion is successful, log the user out
          localStorage.removeItem("token");
          setAuth(false);
        } else {
          // Handle error if deletion fails
          console.error("Failed to delete profile");
        }
      } catch (error) {
        console.error(error);
      }
    }
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

  if (!person.image){
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-5 profile-card">
      <div className="profile-header">
        <h1 className="profile-title">Personal Information</h1>
      </div>
      <div className="profile-body">
        <div className="profile-picture">
          <img src={require('../images/' + person.image)} alt="../images/avatar.png" className="profile-image" />
        </div>
        <div className="profile-details">
        <div className="profile-item">
            <label htmlFor="uuid" className="profile-label">Unique User ID:</label>
            <div className="profile-value">{person.person_name + "#" + person.person_id}</div>
          </div>
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
            <div className="profile-value">{person.date_of_birth.split('T')[0]}</div>
          </div>
          <div className="profile-item">
            <label htmlFor="email" className="profile-label">Email:</label>
            <div className="profile-value">{person.email}</div>
          </div>
          <div className="profile-item">
            <label htmlFor="phone" className="profile-label">Phone:</label>
            <div className="profile-value">{person.phone}</div>
          </div>
          <div className="profile-item">
            <label htmlFor="division" className="profile-label">Division:</label>
            <div className="profile-value">{person.division}</div>
          </div>
          <div className="profile-item">
            <label htmlFor="city" className="profile-label">City:</label>
            <div className="profile-value">{person.city}</div>
          </div>
          <div className="profile-item">
            <label htmlFor="address" className="profile-label">Address:</label>
            <div className="profile-value">{person.street_name + ", " + person.house_number + ", postcode-" + person.post_code}</div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between profile-footer">
        <div>
          <button className="btn btn-primary profile-button" onClick = {e => logout(e)}>Logout</button>
        </div>
        <div>
          <button className="btn btn-warning profile-button" onClick={updateProfile}>Update</button>
          <button className="btn btn-danger profile-button" onClick={ e => deleteProfile(e)}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
