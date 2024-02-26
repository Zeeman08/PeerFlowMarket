import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import {useData} from '../context/PersonContext';
import '../stylesheet.css';
import './dropdown.css';

const Orders = () => {
  //Storing data for search bars

  //Storing data for transactions for the table
  //Original data
  const[groups, setGroups] = useState([]);

  //Buffer data used on table
  const[displayGroups, setDisplay] = useState([]);

  //For going to other pages
  let navigate = useNavigate();
  const {person} = useData();
  //The useEffect hook that calls the getStores() function
  useEffect(() => {

    //The async function that fetches the data from the database
    const getOrders = async () => {
      try {
        const response = await fetch(`http://localhost:3005/getGroupOrders/${person.person_id}/0`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            order_type : "incoming" ,
            delivery_status : "not delivered"
        })
      });
        const jsonData = await response.json();
        setGroups(jsonData.data.groups);
        setDisplay(jsonData.data.groups);
        console.log("before");
        console.log(groups);
        console.log("after");
      }
      catch (err) {
        console.log(err);
      }
    };

    
    getOrders();
  }, [person]);

  /*******************/
  /****TABLE STUFF****/
  /*******************/


  return (
    <div className="container">
      <div>
        {/* header */}
        <div>
          <h1 className = "font-weight-light display-1 text-center mt-4">
            Orders
          </h1>
        </div>

        {/* table */}
        <div>
          <table className="table table-hover table-secondary table-striped table-bordered text-center">
            <thead className="table-dark">
            <tr className="bg-primary">
                <th scope="col">Orders</th>
              </tr>
            </thead>
            <tbody>
              {displayGroups.map (group => (
                <tr key={group.group_id}>
                    <td>{group.group_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Orders;