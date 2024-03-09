import React, {useState, useEffect} from 'react'

const Admin = ({setAdmin}) => {

  const [showActions, setShowActions] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showFunctions, setShowFunctions] = useState(true);

  const logout = (e) => {
    e.preventDefault();
    console.log("logout");
    localStorage.removeItem("admintoken");
    setAdmin(false);
  };



  return (
    <div>
      <div className="d-flex mt-5 justify-content-evenly">
        <h1 className='text-centered'>Admin Portal</h1>
      </div>
      <div className="d-flex mt-5 justify-content-evenly">
        <button className="btn btn-primary" onClick={e => logout(e)}>Logout</button>
      </div>
    </div>
  )
}

export default Admin
