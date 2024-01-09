import React, {Fragment, useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

const StoreFrontUpdate = () => {
  //Getting id from link
  const {id} = useParams();

  //Storing the data from database into store using setStore function
  const[store, setStore] = useState([]);

  //Handling form stuff
  const[name, setName] = useState("");
  const[desc, setDesc] = useState("");
  const[image, setImage] = useState("");

  //For going back to home page
  let navigate = useNavigate();


  //The useEffect hook that calls the getStore() function
  useEffect(() => {

    //The async function that fetches the data from the database
    const getStore = async () => {
      try {
        const response = await fetch(`http://localhost:3005/getStore/${id}`);
        const jsonData = await response.json();
        //console.log(jsonData);
        setStore(jsonData.data.people);
      }
      catch (err) {
        console.log(err);
      }
    };

    //Being called
    setName(store.name);
    getStore();
  }, [id, store.name]);

  const onSubmitForm = async (e) => {
    try {
        const body = {name};
        const response = await fetch(`http://localhost:3005/updatePeople/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        console.log(response);

        //Go back to home page
        navigate("/");
    }
    catch (err) {
        console.log(err)
    }
};

  return (
    <Fragment>
      <h1 className='text-center mt-5'>Update StoreFront</h1>
      <form className="form-control mt-4 mb-4">
        <div>
          <label htmlFor='name'>Name:</label>
          <input type="text" className="form-control mt-2 mb-2" value={name}
          onChange={e => setName(e.target.value)}/>
          <label htmlFor='name'>Description:</label>
          <input type="text" className="form-control mt-2 mb-2" value={desc}
          onChange={e => setDesc(e.target.value)}/>
          <label htmlFor='name'>Image:</label>
          <input type="text" className="form-control mt-2 mb-2" value={image}
          onChange={e => setImage(e.target.value)}/>
          <btn className="btn btn-success ml" onClick={onSubmitForm}>Save Changes</btn>
        </div>       
      </form>
    </Fragment>
  )
}

export default StoreFrontUpdate;
