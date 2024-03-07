import React, { useState } from 'react'
import {Link, useNavigate } from 'react-router-dom';

const Register = () => {

  const [inputs, setInputs] = useState({
    email: "rubai@gmail.com",
    password: "123",
    name: "Rubai",
    dob: "2001-05-01",
    phone: "12345"
  });

  let navigate = useNavigate();

  const { email, password, name, dob, phone } = inputs;

  const [image, setImage] = useState(null);

  const onChange = e => {
    setInputs({...inputs, [e.target.name]: e.target.value})
  };

  const onFileChange = e => {

    // Set the selected file
    const file = e.target.files[0];
    setImage(file);

    // Resize image
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxSize = 223; // Maximum size for profile picture

        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio
        const aspectRatio = width / height;

        // Determine new dimensions while maintaining aspect ratio
        if (width > height) {
          width = maxSize;
          height = maxSize / aspectRatio;
        } else {
          height = maxSize;
          width = maxSize * aspectRatio;
        }

        // Create canvas and resize image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
          setImage(resizedFile);
        }, 'image/jpeg', 0.8); // Quality set to 80%
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("image", image);

    try {
      const imgres = await fetch("http://localhost:3005/upload", {
        method: "POST",
        body: formData
      });

      const parseImg = await imgres.json();

      const body = { name, password, email, dob, phone, image: parseImg.filename };
  
      const response = await fetch("http://localhost:3005/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
  
      const parseRes = await response.json();
  
      if (!parseRes.token) {
        alert("Registration Failed");
        return;
      }

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className="text-center my-5">Register</h1>
      <form onSubmit={onSubmitForm}>
        <input type="email" name="email" placeholder="Email" className="form-control my-3" value={email} onChange={e => onChange(e)}/>
        <input type="password" name="password" placeholder="Password" className="form-control my-3" value={password} onChange={e => onChange(e)}/>
        <input type="text" name="name" placeholder="Name" className="form-control my-3" value={name} onChange={e => onChange(e)}/>
        <input type="dob" name="dob" placeholder="YYYY-MM-DD" className="form-control my-3" value={dob} onChange={e => onChange(e)}/>
        <input type="phone" name="phone" placeholder="Password" className="form-control my-3" value={phone} onChange={e => onChange(e)}/>
        <input type="file" name="image" className="form-control my-3" onChange={e => onFileChange(e)} />
        <button className="btn btn-success">Submit</button>
      </form>
      <Link to="/">Login</Link>
    </div>
  )
}

export default Register;
