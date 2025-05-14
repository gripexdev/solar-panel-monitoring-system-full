import React, {useState} from "react";
import UserService from "../service/UserService";
import { useNavigate } from "react-router-dom";

function RegistrationPage(){

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        city: ''
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData,
            [name] : value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            // Call the register method from the UserService
            const token = localStorage.getItem('token');
            const response = await UserService.register(formData, token);

            if(response.statusCode === 200){
                alert(response.message);
                 // Clear the form fields after successful registration
            setFormData({
                name: '',
                email: '',
                password: '',
                role: '',
                city: ''
            })
            navigate('/admin/user-management');
            }else if(response.statusCode === 409){
                alert(response.message);
            }else{
                alert("An error occurred : " + (response.message || 'Unknown error'))
            }
           

        } catch (error) {
            console.error('Error registering user:', error);
            alert('An error occured while registering user');
            
        }
    }

    return(
        <div className="auth-container">
            <h2>Registration</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name : </label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email : </label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password : </label>
                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Role : </label>
                        <input type="text" name="role" value={formData.role} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>City : </label>
                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                    </div>
                    <button type="submit">Register</button>
                </form>

        </div>
    )

}

export default RegistrationPage;