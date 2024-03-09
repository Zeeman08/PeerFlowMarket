import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/PersonContext';

const UpdateProfile = () => {

    const {person} = useData();

    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: "",
        dob: "",
        phone: "",
        street: "",
        houseNumber: "",
        postCode: 0
      });

    const { email, password, name, dob, phone, street, houseNumber, postCode } = inputs;

    const [image, setImage] = useState(null);

    /*******************/
    /* DROP DOWN STUFF */
    /*******************/

    const [isActive, setIsActive] = useState(false);
    const [selected, setSelected] = useState({division: "Division", city: "City"});
    const [options, setOptions] = useState([]);

    const onChange = e => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    };

    let navigate = useNavigate();

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


        if (person && options) {
            const date = person.date_of_birth.split("T")[0];
            setInputs ({
                email: person.email,
                password: "",
                name: person.person_name,
                dob: date,
                phone: person.phone,
                street: person.street_name,
                houseNumber: person.house_number,
                postCode: person.post_code
            })

            setSelected({
                division: person.division,
                city: person.city,
                location_id: person.location_id
            })
        }
    }, []);


    const onSubmitForm = async () => {
        try {
            if (!password){
                alert("Password is required");
                return;
            }

            let body = {
                name: name,
                email: email,
                password: password,
                dob: dob,
                phone: phone,
                image: person.image,
                location: selected.location_id,
                street: street,
                houseNumber: houseNumber,
                postCode: postCode
            }
            if(image) {
                const formData = new FormData();
                formData.append("image", image);
                const imgres = await fetch("http://localhost:3005/upload", {
                method: "POST",
                body: formData
                });
                const parseImg = await imgres.json();
                body.image = parseImg.filename;
            }
            
            const response = await fetch(`http://localhost:3005/auth/update/${person.person_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
                
            setTimeout(() => {
                navigate(`/profile`);
            }, 500);
        } catch (err) {
            console.log(err)
            alert("Update Failed");
        }
      };

    return (
        <div style={{ paddingBottom: '60px' }}>
            <h1 className="text-center my-5">Update Profile</h1>
            <form>
                <input type="email" name="email" placeholder="Email" className="form-control my-3" value={email} onChange={e => onChange(e)}/>
                <input type="password" name="password" placeholder="Enter new password" className="form-control my-3" value={password} onChange={e => onChange(e)}/>
                <input type="text" name="name" placeholder="Name" className="form-control my-3" value={name} onChange={e => onChange(e)}/>
                <input type="date" name="dob" className="form-control my-3" value={dob} onChange={e => onChange(e)}/>

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
                <input type="text" name="street" placeholder="Street Name" className="form-control my-3" value={street} onChange={e => onChange(e)} />
                <input type="text" name="houseNumber" placeholder="House Number" className="form-control my-3" value={houseNumber} onChange={e => onChange(e)} />
                <input type="number" name="postCode" placeholder="Post Code" className="form-control my-3" value={postCode} onChange={e => onChange(e)} />

                <input type="phone" name="phone" placeholder="Phone" className="form-control my-3" value={phone} onChange={e => onChange(e)}/>
                <input type="file" name="image" className="form-control my-3" onChange={e => onFileChange(e)} />
            </form>
            <div className="d-flex justify-content-between">
                <button className="btn btn-success mt-2" onClick={onSubmitForm}>Submit</button>
                <button className="btn btn-danger mt-2" onClick={() => navigate(`/profile`)}>Cancel</button>
            </div>
        </div>
  )
}

export default UpdateProfile
