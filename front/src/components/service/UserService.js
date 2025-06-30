import axios from "axios";

class UserService{
    static API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080"

    static async login(email, password){
        try{

            const response = await axios.post(`${UserService.API_BASE_URL}/auth/login`, {email, password})
            return response.data;

        }catch(err){
            throw err;
        };
        
    }

    static async register(userData, token){
        try{
            const response = await axios.post(`${UserService.API_BASE_URL}/auth/register`, userData, {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getAllUsers(token){
        try{
            const response = await axios.get(`${UserService.API_BASE_URL}/admin/get-all-users`, {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getYourProfile(token){
        try{
            const response = await axios.get(`${UserService.API_BASE_URL}/adminuser/get-profile`, {
                headers: {Authorization:`Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async getUserById(userId, token){
        try{
            const response = await axios.get(`${UserService.API_BASE_URL}/admin/get-user/${userId}`, {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async deleteUser(userId, token){
        try{
            const response = await axios.delete(`${UserService.API_BASE_URL}/admin/deleteUser/${userId}`, {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    static async updateUser(userId, userData, token){
        try{
            const response = await axios.put(`${UserService.API_BASE_URL}/admin/update/${userId}`, userData, {
                headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
        }catch(err){
            throw err;
        }
    }

    /**Authentication Checker */
    static logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    static isAuthenticated(){
        const token = localStorage.getItem('token')
        return !!token // Convert token to a boolean and return it
    }

    static isAdmin(){
        const role = localStorage.getItem('role')
        return role && role.toUpperCase() === 'ADMIN'
    }

    static isUser(){
        const role = localStorage.getItem('role')
        return role.toUpperCase()=== 'USER'
    }

    static adminOnly(){
        return this.isAuthenticated() && this.isAdmin();
    }
}

export default UserService;