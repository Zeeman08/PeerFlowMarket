import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import {useData} from '../context/PersonContext';
import '../stylesheet.css';
import './dropdown.css';

const Transactions = () => {
  //Storing data for search bars

  //Storing data for transactions for the table
  //Original data
  const[transactions, setTransactions] = useState([]);

  //Buffer data used on table
  const[displayTransactions, setDisplay] = useState([]);

  //For going to other pages
  let navigate = useNavigate();
  const {person} = useData();
  //The useEffect hook that calls the getStores() function
  useEffect(() => {

    //The async function that fetches the data from the database
    const getTransactions = async () => {
      try {
        const response = await fetch(`http://localhost:3005/getTransactions/${person.person_id}`);
        const jsonData = await response.json();
        setTransactions(jsonData.data.transactions);
        setDisplay(jsonData.data.transactions);
        console.log("before");
        console.log(transactions);
        console.log("after");
      }
      catch (err) {
        console.log(err);
      }
    };

    
    getTransactions();
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
            Transactions
          </h1>
        </div>

        {/* table */}
        <div>
          <table className="table table-hover table-secondary table-striped table-bordered text-center">
            <thead className="table-dark">
              <tr className="bg-primary">
                <th scope="col">Transaction ID</th>
                <th scope="col">StoreFront Name</th>
                <th scope="col">Transaction Amount</th>
                <th scope="col">Time</th>
                <th scope="col">Medium</th>
              </tr>
            </thead>
            <tbody>
              {displayTransactions.map (transaction => (
                <tr key={transaction.transaction_id}>
                    <td>{transaction.transaction_id}</td>
                  <td>{transaction.storefront_name}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.transaction_time}</td>
                  <td>{transaction.transaction_type}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Transactions;