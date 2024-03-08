import React, { useState } from 'react'
import {Link} from 'react-router-dom';

const AdminLogin = ({setAuth2}) => {

    
    const [password, setPassword] = useState("");

    const onSubmitForm = async(e) => {
        try {
            const response = await fetch("http://localhost:3005/auth/adminLogin", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({password})
            });
    
            const parseRes = await response.json();
    
            if (parseRes.token === undefined){
              alert("Invalid credentials");
              return;
            }

            console.log("Here");
            console.log(parseRes.token);
    
            localStorage.setItem("admintoken", parseRes.token);
            setAuth2(true);
            
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1 className="text-center my-5">Admin Login</h1>
            <form onSubmit={e => onSubmitForm(e)}>
            <input type="password" name="password" placeholder="password" className="form-control my-3" value={password} onChange={e => setPassword(e.target.value)}/>
            <button className="btn btn-success">Submit</button>
            </form>
            <div className="mt-1">
            <Link to="/login">Login</Link>
            </div>
            <div className="mt-1">
            <Link to="/register">Register</Link>
            </div>
        </div>
    )
}

export default AdminLogin
