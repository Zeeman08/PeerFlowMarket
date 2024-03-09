import React, { useState, useEffect } from 'react'
import {Link, useNavigate } from 'react-router-dom';

const Register = ({setAuth}) => {

  const [inputs, setInputs] = useState({
    email: "rubai@gmail.com",
    password: "123",
    name: "Rubai",
    dob: "2001-05-01",
    phone: "12345",
    street: "New Enfield", // New field for street name
    houseNumber: "104/B2", // New field for house number
    postCode: 2400 // New field for post code
  });

  let navigate = useNavigate();

  const { email, password, name, dob, phone, street, houseNumber, postCode } = inputs;

  const [image, setImage] = useState(null);


  /*******************/
  /* DROP DOWN STUFF */
  /*******************/

  const [isActive, setIsActive] = useState(false);
  const [selected, setSelected] = useState({division: "Division", city: "City"});
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // Get locations from the server
    const getLocations = async () => {
      try {
        const response = await fetch("http://localhost:3005/getLocations");
        const parseRes = await response.json();
        setOptions(parseRes.data.locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    getLocations();
  }, []);

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

    if (!street || !houseNumber || !postCode || selected.division === "Division" || selected.city === "City") {
      alert("Please fill in all address fields");
      return;
    }

    var parseImg = {filename: "avatar.png"};

    try {
      if (image){
        const formData = new FormData();
        formData.append("image", image);
        const imgres = await fetch("http://localhost:3005/upload", {
          method: "POST",
          body: formData
        });

        parseImg = await imgres.json();
      }

      const body = {name, password, email, dob, phone, image: parseImg.filename, location: selected.location_id, street, houseNumber, postCode};
  
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

      localStorage.setItem("token", parseRes.token);
      localStorage.removeItem("adminToken");
      setAuth(true);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className="text-center my-5">Register</h1>
      <form onSubmit={onSubmitForm}>
        <label htmlFor="email">Email:</label>
        <input type="email" name="email" placeholder="Email" className="form-control my-3" value={email} onChange={e => onChange(e)}/>
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" placeholder="Password" className="form-control my-3" value={password} onChange={e => onChange(e)}/>
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" placeholder="Name" className="form-control my-3" value={name} onChange={e => onChange(e)}/>
        <label htmlFor="dob">Date of Birth:</label>
        <input type="date" name="dob" className="form-control my-3" value={dob} onChange={e => onChange(e)}/>
        
        <label htmlFor="location">Location:</label>
        {/* Dropdown for Division - City */}
        <div className="dropdown">
          <div className="dropdown-btn" onClick={e => setIsActive(!isActive)}>
            {selected.division + " - " + selected.city}
            <span className="fas fa-caret-down"></span>
          </div>
          {isActive && (
            <div className="dropdown-content">
              {options.map(option => (
                <div key={option.category_name} className="dropdown-item" onClick={e => {
                  setSelected(option);
                  setIsActive(false);
                }}>{option.division + " - " + option.city}</div>
              ))}
            </div>
          )}
        </div>

        <label htmlFor="street">Street:</label>
        <input type="text" name="street" placeholder="Street Name" className="form-control my-3" value={street} onChange={e => onChange(e)} />
        <label htmlFor="houseNumber">House Number:</label>
        <input type="text" name="houseNumber" placeholder="House Number" className="form-control my-3" value={houseNumber} onChange={e => onChange(e)} />
        <label htmlFor="postCode">Post Code:</label>
        <input type="number" name="postCode" placeholder="Post Code" className="form-control my-3" value={postCode} onChange={e => onChange(e)} />
        
        <label htmlFor="phone">Phone:</label>
        <input type="number" name="phone" placeholder="Phone" className="form-control my-3" value={phone} onChange={e => onChange(e)}/>
        <label htmlFor="image">Profile Picture:</label>
        <input type="file" name="image" className="form-control my-3" onChange={e => onFileChange(e)} />
        <button className="btn btn-success">Submit</button>
      </form>
      <div className="mt-1">
        <Link to="/">Login</Link>
      </div>
      <div style={{ paddingBottom: '40px' }}>
        <Link to="/adminLogin">Admin Portal</Link>
      </div>
    </div>
  )
}

export default Register;
