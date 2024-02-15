import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import {useData} from '../context/PersonContext';

const Login = ({setAuth}) => {

  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });

  const {PID, setPID} = useData();
  const {email, password} = inputs;

  const onChange = (e) => {
    setInputs({...inputs, [e.target.name]: e.target.value});
  };

  const onSubmitForm = async(e) => {
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:3005/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        });

        const parseRes = await response.json();

        if (parseRes.token === undefined)
          return;

        localStorage.setItem("token", parseRes.token);
        setAuth(true);

        setPID(parseRes.person_id);
        
        console.log(parseRes);
    } catch (error) {
        console.log(error);
    }
  };

  return (
    <div>
      <h1 className="text-center my-5">Login</h1>
      <form onSubmit={onSubmitForm}>
        <input type="email" name="email" placeholder="email" className="form-control my-3" value={email} onChange={e => onChange(e)}/>
        <input type="password" name="password" placeholder="password" className="form-control my-3" value={password} onChange={e => onChange(e)}/>
        <button className="btn btn-success">Submit</button>
      </form>
      <Link to="/register">Register</Link>
    </div>
  )
}

export default Login;
