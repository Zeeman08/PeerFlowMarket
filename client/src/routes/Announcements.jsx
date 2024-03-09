import React, {useEffect, useState,} from 'react'
import { useParams, useNavigate } from 'react-router-dom';

const Announcements = () => {

  const [announcements, setAnnouncements] = useState([]);

  const { id } = useParams();

  let navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`http://localhost:3005/getStoreAnnouncements/${id}`);
        const jsonData = await response.json();
        setAnnouncements(jsonData.data.announcements);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };
    fetchAnnouncements();
  }, []);

  const deleteAnnouncement = async (aid) => {
    try {
        const response = await fetch(`http://localhost:3005/deleteAnnouncement/${aid}`, {
            method: "DELETE"
        });

        setAnnouncements(announcements.filter(announcement => announcement.announcement_id !== aid));
    } catch (error) {
        console.log(error);
    }
  };

  return (
    <div>
        <h1 className='text-center mt-5 mb-5'>Announcements</h1>
        {/* table */}
        <div>
            <table className="table table-hover table-secondary table-striped table-bordered text-center">
            <thead className="table-dark">
                <tr className="bg-primary">
                <th scope="col">Image</th>
                <th scope="col">Description</th>
                <th scope="col">Posted On</th>
                <th scope="col">Update</th>
                <th scope="col">Delete</th>
                </tr>
            </thead>
            <tbody>
                {announcements.map (announcement => (
                <tr key={announcement.announcement_id}>
                    <td>
                        <img
                        src={require(`../images/${announcement.image ? announcement.image:"Deal.png"}`)}
                        alt="../images/Deal.png"
                        style={{ width: '40%', height: 'auto', alignSelf: 'center'}}
                        />    
                    </td>
                    <td>{announcement.announcement_description}</td>
                    <td>{announcement.posted_on.split("T")[0]}</td>
                    <td><button className="btn btn-warning" onClick={e => navigate(`/updateAnnouncement/${announcement.announcement_id}`)}>Update</button></td>
                    <td><button className="btn btn-danger" onClick={e => deleteAnnouncement(announcement.announcement_id)}>Delete</button></td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
    </div>
  )
}

export default Announcements
