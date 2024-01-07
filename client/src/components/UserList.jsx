import React, {Fragment, useEffect, useState} from 'react';

const UserList = () => {
  //The storing the data from database into users using setUsers function
  const[users, setUsers] = useState([]);

  //The async function that deletes the data from the database
  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:3005/deletePeople/${id}`, {
        method: "DELETE"
      });

      //Resetting data in users by removing or not keep any users that have the same id as the one deleted
      //!= means value not equal, !== means value and type not equal
      //JS just prefers !== over !=
      setUsers(users.filter(user => user.id !== id));
      console.log(response);
    }
    catch (err) {
      console.log(err);
    }
  };

  //The async function that fetches the data from the database
  const getUsers = async () => {
    try {
      const response = await fetch("http://localhost:3005/getPeople");
      const jsonData = await response.json();
      //console.log(jsonData);
      setUsers(jsonData.data.people);
    }
    catch (err) {
      console.log(err);
    }
  };

  //The useEffect hook that calls the async function
  useEffect(() => {
    getUsers();
  }, []);

  //Returning the actual table
  return (
    <Fragment>
      <table className="table table-hover table-secondary table-striped table-bordered text-center">
        <thead className="table-dark">
          <tr className="bg-primary">
            <th scope="col">UserID</th>
            <th scope="col">UserName</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {/* Storing table data format
          <tr>
            <td>3</td>
            <td>John</td>
            <td><button className="btn btn-warning">Update</button></td>
            <td><button className="btn btn-danger">Delete</button></td>
          </tr>
          */}
          {users.map (user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td><button className="btn btn-warning">Update</button></td>
              <td><button className="btn btn-danger" onClick={() => deleteUser(user.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default UserList;
