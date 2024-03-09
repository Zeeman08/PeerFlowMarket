import React, { useState } from 'react';
import {Link} from 'react-router-dom';

const Login = ({setAuth}) => {

  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });

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

        if (parseRes.token === undefined){
          alert("Invalid credentials");
          return;
        }

        localStorage.setItem("token", parseRes.token);
        setAuth(true);
        
    } catch (error) {
        console.log(error);
    }
  };

  return (
    <div>
      <h1 className="text-center my-5">Login</h1>
      <form onSubmit={e => onSubmitForm(e)}>
        <input type="email" name="email" placeholder="email" className="form-control my-3" value={email} onChange={e => onChange(e)}/>
        <input type="password" name="password" placeholder="password" className="form-control my-3" value={password} onChange={e => onChange(e)}/>
        <button className="btn btn-success">Submit</button>
      </form>
      <div className="mt-1">
        <Link to="/register">Register</Link>
      </div>
    </div>
  )
}

export default Login;
