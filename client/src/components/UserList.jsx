import React from 'react';

const UserList = () => {
  return (
    <div className="list-group">
      <table className="table table-hover table-secondary table-striped table-bordered">
        <thead className="table-dark">
          <tr className="bg-primary">
            <th scope="col" className="text-center">UserID</th>
            <th scope="col" className="text-center">UserName</th>
            <th scope="col" className="text-center">Update</th>
            <th scope="col" className="text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center">3</td>
            <td className="text-center">John</td>
            <td><button className="btn btn-warning">Update</button></td>
            <td><button className="btn btn-danger">Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
