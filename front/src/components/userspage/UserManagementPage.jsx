import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import UserService from "../service/UserService";

function UserManagementPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch users data when the component mounts
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {

            const token = localStorage.getItem('token')
            const response = await UserService.getAllUsers(token)
            
            setUsers(response.ourUsersList); // Assuming the list of users is under the key 'ourUsersList'
            
        } catch (error) {
            console.error('Error fetching users : ', error)
        }
    }

    const deleteUser = async (userId) => {
        try {
         const confirmDelete = window.confirm('Are you sure you want to delete this user?');
         const token = localStorage.getItem('token')
         if(confirmDelete){
            await UserService.deleteUser(userId, token)
            fetchUsers();
         }
        } catch (error) {
            console.error("Error deleting user : ", error)
        }
    }
    return(
        <div className="user-management-container">
            <div className="user-management-actions">
                <h2>Users Management Page</h2>
                <button className="reg-button"><Link to="/register">Add User</Link></button>
            </div>

            <table className='user-table'>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                            <div className='action-buttons'>
                                <button className="btn delete-button" onClick={() => deleteUser(user.id)}>Delete</button>
                                <button className="btn btn-update"><Link to={`/update-user/${user.id}`}>Update</Link></button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default UserManagementPage;

