import React, { useState } from 'react'
import {Link} from 'react-router-dom';

const Register = ({setAuth}) => {

  const [inputs, setInputs] = useState({
    email: "gawwy@gmail.com",
    password: "123",
    name: "Gawwy",
    dob: "2001-05-01",
    phone: "123456789"
  });

  const { email, password, name, dob, phone } = inputs;

  const onChange = e => {
    setInputs({...inputs, [e.target.name]: e.target.value})
  };

  const onSubmitForm = async(e) => {
    e.preventDefault();

    const body = { name, password, email, dob, phone}

    try {
        const response = await fetch("http://localhost:3005/auth/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        const parseRes = await response.json();

        if (parseRes.token) {
          localStorage.setItem("token", parseRes.token);
          setAuth(true);
        }
        else{
          alert("Registration Failed");
        }

    } catch (error) {
        console.log(error);
    }

  };

  return (
    <div>
      <h1 className="text-center my-5">Register</h1>
      <form onSubmit={onSubmitForm}>
        <input type="email" name="email" placeholder="email" className="form-control my-3" value={email} onChange={e => onChange(e)}/>
        <input type="password" name="password" placeholder="password" className="form-control my-3" value={password} onChange={e => onChange(e)}/>
        <input type="text" name="name" placeholder="name" className="form-control my-3" value={name} onChange={e => onChange(e)}/>
        <input type="dob" name="dob" placeholder="2002-05-01" className="form-control my-3" value={dob} onChange={e => onChange(e)}/>
        <input type="phone" name="phone" placeholder="password" className="form-control my-3" value={phone} onChange={e => onChange(e)}/>
        <button className="btn btn-success">Submit</button>
      </form>
      <Link to="/">Login</Link>
    </div>
  )
}

export default Register;
