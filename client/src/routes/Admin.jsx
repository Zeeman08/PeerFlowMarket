import React, {useState, useEffect} from 'react'

const Admin = ({setAdmin}) => {

  const [showActions, setShowActions] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showFunctions, setShowFunctions] = useState(true);

  const [displayActions, setDisplayActions] = useState([]);
  const [displayTransactions, setDisplayTransactions] = useState([]);
  const [displayFunctions, setDisplayFunctions] = useState([]);

  const logout = (e) => {
    e.preventDefault();
    console.log("logout");
    localStorage.removeItem("admintoken");
    setAdmin(false);
  };

  useEffect(() => {
    try {
      const getData = async () => {
        const response = await fetch("http://localhost:3005/getActions");
        const jsonData = await response.json();
        setDisplayActions(jsonData.data.actions);
        setShowActions(true);

        const response2 = await fetch("http://localhost:3005/getTransactions");
        const jsonData2 = await response2.json();
        setDisplayTransactions(jsonData2.data.transactions);

        const response3 = await fetch("http://localhost:3005/getFunctions");
        const jsonData3 = await response3.json();
        setDisplayFunctions(jsonData3.data.functions);
      };

      getData();
    } catch (error) {
      console.log(error);
    }
  }, []);



  return (
    <div>
      <div className="d-flex mt-5 justify-content-evenly">
        <h1 className='text-centered'>Admin Portal</h1>
      </div>
      <div className="d-flex mt-5 justify-content-evenly">
        <button className="btn btn-success" onClick={e => {
          setShowActions(true);
          setShowFunctions(false);
          setShowTransactions(false);
        }}>Actions</button>
        <button className="btn btn-success" onClick={e => {
          setShowTransactions(true)
          setShowFunctions(false);
          setShowActions(false);
        }}>Transactions</button>
        <button className="btn btn-success" onClick={e => {
          setShowFunctions(true)
          setShowActions(false);
          setShowTransactions(false);
        }}>Functions</button>
        <button className="btn btn-primary" onClick={e => logout(e)}>Logout</button>
      </div>
      {showActions && (
        <div className="mt-5" style={{ maxHeight: '700px', overflowY: 'scroll' }}>
          <h3>Actions</h3>
          <table className="table table-hover table-secondary table-striped table-bordered text-center">
            <thead className="table-dark">
              <tr className="bg-primary">
                <th scope="col">Action_ID</th>
                <th scope="col">Person_ID</th>
                <th scope="col">Storefront_ID</th>
                <th scope="col">Product_ID</th>
                <th scope="col">Action_Type</th>
                <th scope="col">Action_Time</th>
              </tr>
            </thead>
            <tbody>
              {displayActions.map (action => (
                <tr key={action.action_id}>
                  <td>{action.action_id}</td>
                  <td>{action.person_id ? action.person_id : "null"}</td>
                  <td>{action.storefront_id ? action.storefront_id : "null"}</td>
                  <td>{action.product_id ? action.product_id : "null"}</td>
                  <td>{action.action_type}</td>
                  <td>{action.action_time.split("T")[0]}</td>
                </tr>
              ))}
              </tbody>
          </table>
        </div>
      )}
      {showFunctions && (
        <div className="mt-5" style={{ maxHeight: '700px', overflowY: 'scroll' }}>
          <h3>Functions</h3>
          <table className="table table-hover table-secondary table-striped table-bordered text-center">
            <thead className="table-dark">
              <tr className="bg-primary">
                <th scope="col">Log_ID</th>
                <th scope="col">Person_ID</th>
                <th scope="col">Function_Name</th>
                <th scope="col">Parameters</th>
                <th scope="col">Log_Time</th>
              </tr>
            </thead>
            <tbody>
              {displayFunctions.map (func => (
                <tr key={func.log_id}>
                  <td>{func.log_id}</td>
                  <td>{func.person_id}</td>
                  <td>{func.function_name}</td>
                  <td>{func.parameters}</td>
                  <td>{func.log_time.split("T")[0]}</td>
                </tr>
              ))}
              </tbody>
          </table>
        </div>
      )}
      {showTransactions && (
        <div className="mt-5" style={{ maxHeight: '700px', overflowY: 'scroll' }}>
          <h3>Transactions</h3>
          <table className="table table-hover table-secondary table-striped table-bordered text-center">
            <thead className="table-dark">
              <tr className="bg-primary">
                <th scope="col">Transaction_ID</th>
                <th scope="col">Person_ID</th>
                <th scope="col">Storefront_ID</th>
                <th scope="col">Amount</th>
                <th scope="col">Transaction_Type</th>
                <th scope="col">Transaction_Time</th>
              </tr>
            </thead>
            <tbody>
              {displayTransactions.map (transaction => (
                <tr key={transaction.transaction_id}>
                  <td>{transaction.transaction_id}</td>
                  <td>{transaction.person_id}</td>
                  <td>{transaction.storefront_id}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.transaction_type}</td>
                  <td>{transaction.transaction_time.split("T")[0]}</td>
                </tr>
              ))}
              </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Admin
