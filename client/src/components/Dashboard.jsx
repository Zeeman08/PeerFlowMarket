import React, {useState, useEffect} from 'react'

const Dashboard = ({setAuth}) => {
  
  const [name, setName] = useState("");

  const getName = async () => {
    try {
        const response = await fetch("http://localhost:3005/dashboard/", {
            method: "GET",
            headers: {token: localStorage.token}
        });

        const parseRes = await response.json();

        setName(parseRes.person_name);
    } catch (error) {
        console.log(error);
    }
  }

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
  };

  useEffect(() => {
    getName();
  }, []);

  return (
    <div>
      <h1 className="text-center my-5">Welcome {name}</h1>
      <button className="btn btn-primary" onClick={e => logout(e)}>Logout</button>
    </div>
  )
}

export default Dashboard;
