import React from "react";
import { Link } from "react-router-dom";

export default function BuyerProfile({ user }) {
  return (
    <table className="table table-bordered">
      <tbody>
        <tr>
          <th>Name</th>
          <td>{user.name}</td>
        </tr>
        <tr>
          <th>User Name</th>
          <td>{user.username}</td>
        </tr>
        <tr>
          <th>Email</th>
          <td>{user.email}</td>
        </tr>
        <tr>
          <th>Phone</th>
          <td>{user.phone}</td>
        </tr>
        <tr>
          <th>Role</th>
          <td>{user.role}</td>
        </tr>

        <tr>
          <th>Address Line1 </th>
          <td>{user.addressline1}</td>
        </tr>
        <tr>
          <th>Address Line2 </th>
          <td>{user.addressline2}</td>
        </tr>
        <tr>
          <th>Address Line3 </th>
          <td>{user.addressline3}</td>
        </tr>
        <tr>
          <th>Pin</th>
          <td>{user.pin}</td>
        </tr>
        <tr>
          <th>City</th>
          <td>{user.city}</td>
        </tr>
        <tr>
          <th>State</th>
          <td>{user.state}</td>
        </tr>
        <tr>
          <th>GST Number</th>
          <td>{user.gstNumber || 'Not provided'}</td>
        </tr>
        <tr>
          <td colSpan={2}>
            <Link className="btn main-color w-100" to="/update-profile">
              Update
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
