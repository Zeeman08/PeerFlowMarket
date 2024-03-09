import React, {useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom';

const UpdateAnnouncement = () => {

    const [image, setImage] = useState(null);
    const [announcementText, setAnnouncementText] = useState('');

    const {id} = useParams();

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
    
    const saveChanges = async (e) => {
        e.preventDefault();

        if (image === null) {
            const response = await fetch(`http://localhost:3005/updateAnnouncement/${id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  description: announcementText,
                  image: "Deal.png",
                }),
              });
            navigate("/yourstores");
            return;
        }
      
        const formData = new FormData();
        formData.append("image", image);
        try {
          const imgres = await fetch("http://localhost:3005/upload", {
            method: "POST",
            body: formData
          });
    
          const parseImg = await imgres.json();
    
          const response = await fetch(`http://localhost:3005/updateAnnouncement/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              description: announcementText,
              image: parseImg.filename,
            }),
          });
        } catch (err) {
          console.error('Error posting announcement:', err);
        }

        navigate("/yourstores");
      };

    return (
        <div>
            <form className='mb-4'>
            <div className='mb-3 mt-5'>
                <h2>Change your announcement:</h2>
                <input type="file" name="image" className="form-control my-3" onChange={e => onFileChange(e)} />
                <textarea
                className='form-control'
                id='announcementTextarea'
                rows='3'
                value={announcementText}
                onChange={e => setAnnouncementText(e.target.value)}
                ></textarea>
            </div>
            <div className="d-flex justify-content-between">
                <button
                    type='button'
                    className='btn btn-success'
                    onClick={e => saveChanges(e)}
                >
                    Save Changes
                </button>
                <button className="btn btn-danger" onClick={e => navigate("/yourstores")}>Cancel</button>
            </div>
            </form>
        </div>
    )
}

export default UpdateAnnouncement
