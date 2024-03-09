import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/PersonContext';
import '../stylesheet.css';
import './dropdown.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMoneyCheckAlt, faCheck } from '@fortawesome/free-solid-svg-icons';

const Orders = () => {
  const [groups, setGroups] = useState([]);
  const [groupDetails, setGroupDetails] = useState({});
  const [displayGroups, setDisplay] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [filterOption, setFilterOption] = useState(3); // Default: Show all groups
  const [buttonPressed, setButtonPressed] = useState('Buyer'); // Newly added state for tracking button press
  const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState('0'); // Selected delivery status for buyer
  const [deliveryStatuses, setDeliveryStatuses] = useState({});
  let navigate = useNavigate();
  const { person } = useData();

  useEffect(() => {
    const getOrders = async () => {
      try {
        let requestBody;
        console.log("second");
        console.log(filterOption);
        if (buttonPressed === 'Buyer') {
          requestBody = { order_type: 'incoming', delivery_status: filterOption };
        } else {
          requestBody = { order_type: 'outgoing', delivery_status: filterOption };
        }
        
        const response = await fetch(`http://localhost:3005/getGroupOrders/${person.person_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
        const jsonData = await response.json();
        console.log(jsonData.data.groups);
        setGroups(jsonData.data.groups);
        setDisplay(jsonData.data.groups);
      } catch (err) {
        console.log(err);
      }
    };
    console.log(buttonPressed);
    getOrders();
    //setDisplay(groups);

  }, [person, filterOption, buttonPressed, deliveryStatuses]); // Add filterOption to dependency array

  const toggleGroupDetails = async (groupId) => {
    if (expandedGroups.includes(groupId)) {
      setExpandedGroups((prevExpandedGroups) => prevExpandedGroups.filter((id) => id !== groupId));
    } else {
      try {
        let response;
        if(buttonPressed === 'Buyer'){
          response = await fetch(`http://localhost:3005/getGroupOrder/${groupId}`);
        }
        else {
          response = await fetch(`http://localhost:3005/getGroupOrder/${groupId}/${person.person_id}`);
        }
          const jsonData = await response.json();
        setGroupDetails((prevGroupDetails) => {
          const updatedGroupDetails = { ...prevGroupDetails, [groupId]: jsonData.data.orders };
          return updatedGroupDetails;
        });

        setExpandedGroups((prevExpandedGroups) => [...prevExpandedGroups, groupId]);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const calculateTotalCost = (orders) => {
    return orders.reduce((total, order) => total + order.price * order.quantity, 0);
  };

  // const renderDeliveryStatusIcon = (status) => {
  //   switch (status) {
  //     case 0:
  //       return <FontAwesomeIcon icon={faTimes} color="red" title="Not Delivered" />;
  //     case 1:
  //       return <FontAwesomeIcon icon={faMoneyCheckAlt} color="orange" title="Delivered but not paid" />;
  //     case 2:
  //       return <FontAwesomeIcon icon={faCheck} color="green" title="Paid" />;
  //     default:
  //       return null;
  //   }
  // };

  const renderDeliveryStatusIcon = (groupId) => {
    console.log("renderDeliveryStatusIcon");
    // Use the updated delivery status from the deliveryStatuses state
    if (deliveryStatuses[groupId] === undefined) {
      deliveryStatuses[groupId] = groups.find((group) => group.group_id === groupId)?.delivery_status;
    }
    const updatedStatus = deliveryStatuses[groupId];
    if(updatedStatus === undefined) {
      console.log("undefined status");
    }
    console.log("status: ");
    console.log(updatedStatus);
    switch (updatedStatus) {
      case 0:
        return <FontAwesomeIcon icon={faTimes} color="red" title="Not Delivered" />;
      case 1:
        return <FontAwesomeIcon icon={faMoneyCheckAlt} color="orange" title="Delivered but not paid" />;
      case 2:
        console.log("now in case 2 ");
        
        return <FontAwesomeIcon icon={faCheck} color="green" title="Paid" />;
      default:
        console.log("now in default");
        console.log(updatedStatus);
        return null;
    }
  };


  const handleFilterChange = (event) => {
    setFilterOption(event.currentTarget.value);
    console.log("first");
    console.log(filterOption);
  };

  const handleButtonPress = (button) => {
    setButtonPressed(button);
  };

  const handleDropdownSelect = async(groupId, selectedOption) => {
    setDeliveryStatuses((prevStatuses) => ({
      ...prevStatuses,
      [groupId]: selectedOption,
    }));
    try {
      console.log(`GroupID: ${groupId}, Selected Option: ${selectedOption}`);
      if(selectedOption === '3') return; // If the default option is selected, do nothing
      const shopkeeperId = person.person_id; // Replace with the actual shopkeeper ID
  
      const response = await fetch(`http://localhost:3005/changeDeliveryStatus/${groupId}/${shopkeeperId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          delivery_status: selectedOption, // Assuming selectedOption is the new delivery status
        }),
      });
      
      const jsonData = await response.json();
      console.log(jsonData);
  
      // You can handle the response accordingly, update state, or perform any additional actions.
    } catch (err) {
      console.error(err);
    }
  };


  // const handleDropdownSelect = async (groupId, selectedOption) => {
  //   try {
  //     console.log(`GroupID: ${groupId}, Selected Option: ${selectedOption}`);
  //     if(selectedOption === '3') return; // If the default option is selected, do nothing
  //     const shopkeeperId = person.person_id; // Replace with the actual shopkeeper ID
  
  //     const response = await fetch(`http://localhost:3005/changeDeliveryStatus/${groupId}/${shopkeeperId}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         delivery_status: selectedOption, // Assuming selectedOption is the new delivery status
  //       }),
  //     });
      
  //     const jsonData = await response.json();
  //     console.log(jsonData);
  
  //     // You can handle the response accordingly, update state, or perform any additional actions.
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  

  return (
    <div className="container">
      <div>
        <div className="text-center mb-4">
          {/* Buttons for Left and Right */}
          <h1 className="font-weight-light display-1 text-center mt-4">Orders</h1>
        </div>
        <div>
          {/* Dropdown menu for filtering */}
          <select value={filterOption} onChange={handleFilterChange} className="form-select mb-4">
            <option value="3">Show All</option>
            <option value="0">Not Delivered</option>
            <option value="1">Delivered but not Paid</option>
            <option value="2">Paid</option>
          </select>
          <div className="d-flex justify-content-evenly mt-4 mb-4">
            <button className="btn btn-success" onClick={() => handleButtonPress('Buyer')}>As a buyer</button>
            <button className="btn btn-success" onClick={() => handleButtonPress('Seller')}>As a seller</button>
          </div>
          <table className="table table-hover table-secondary table-striped table-bordered text-center">
            <thead className="table-dark">
              <tr className="bg-primary">
                <th scope="col">ID</th>
                <th scope="col">Order Time</th>
                <th scope="col">Delivery Status</th>
              </tr>
            </thead>
            <tbody>
              {displayGroups.map((group) => (
                <React.Fragment key={group.group_id}>
                  <tr onDoubleClick={() => toggleGroupDetails(group.group_id)}>
                    <td>{group.group_id}</td>
                    <td>{group.order_time}</td>
                    <td>{renderDeliveryStatusIcon(group.group_id)}  {buttonPressed === 'Seller' && (
                      //make a drop down menu here with different options a method to handle the option change 
                      <select
                        value={deliveryStatuses[group.group_id] || '3'}
                        onChange={(e) => handleDropdownSelect(group.group_id, e.target.value)}
                      >
                        <option value="3">Change Delivery Status</option>
                        <option value="0">Not Delivered</option>
                        <option value="1">Delivered but not paid</option>
                        <option value="2">Paid</option>
                      </select>


                      
                      )}</td>
                  </tr>
                  {expandedGroups.includes(group.group_id) && (
                    <tr>
                      <td colSpan="3">
                        {groupDetails[group.group_id] && (
                          <div>
                            {/* Render additional details here */}
                            <ul style={{ listStyle: 'none' }}>
                              {groupDetails[group.group_id].map((order) => (
                                <li key={order.order_id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <div style={{ textAlign: 'left' }}>{order.product_name}</div>
                                  <div style={{ textAlign: 'right' }}>
                                    Quantity: {order.quantity} (${order.price * order.quantity})
                                  </div>
                                </li>
                              ))}
                              <li style={{ textAlign: 'right' }}>
                                Total Cost: ${calculateTotalCost(groupDetails[group.group_id])}
                              </li>
                            </ul>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;