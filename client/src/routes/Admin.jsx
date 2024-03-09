import React from 'react'

const Admin = ({setAdmin}) => {

  const logout = (e) => {
    e.preventDefault();
    console.log("logout");
    localStorage.removeItem("admintoken");
    setAdmin(false);
  };

  return (
    <div>
      HELLO THERE
      <button className="btn btn-primary" onClick={e => logout(e)}>Logout</button>
    </div>
  )
}

export default Admin
