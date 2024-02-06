import React, {useState, useEffect} from 'react'

const Home = ({setAuth}) => {
  
  const [name, setName] = useState("");

  const getDetails = async () => {
    try {
        const response = await fetch("http://localhost:3005/dashboard/", {
            method: "GET",
            headers: {token: localStorage.token}
        });

        const parseRes = await response.json();

        setName(parseRes.person_name);
        localStorage.setItem("person_id", parseRes.person_id);
    } catch (error) {
        console.log(error);
    }
  }

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("person_id");
    setAuth(false);
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <div>
      <h1 className="text-center my-5">Welcome {name}</h1>
      <button className="btn btn-primary" onClick={e => logout(e)}>Logout</button>
    </div>
  )
}

export default Home;
