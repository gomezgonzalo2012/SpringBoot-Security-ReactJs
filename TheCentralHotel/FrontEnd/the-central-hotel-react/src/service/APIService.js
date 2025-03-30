import axios from "axios";
export default class APIService{
    static BASE_URL="http://localhost:8080";
    
    static getHeader () {
        const token = localStorage.getItem("token")
        return {
            Authorization : `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }

    // AUTH
    // Register a new user
    static async register(registration){
        const response = await axios.post(`${this.BASE_URL}/auth/register`, registration)
        return response.data;
    }
    // login a registered user
    // static async login (loginDetails){
    //     const response = await axios.post(`${this.BASE_URL}/auth/login`, loginDetails)
    //     return response.data;

    // }
    static async login (loginDetails){
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginDetails)
        return response.data;

    }
    static logOut(){
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    }
    static isAuthenticated(){
        const token = localStorage.getItem("token")
        if(this.isTokenExpired(token)){
            this.logOut();
        }else{
            return !!token; // token != null
        }
    }
    static isAdmin(){
        const role = localStorage.getItem("role")
        return role === "ADMIN"  
    }
    static isUser(){
        const role = localStorage.getItem("role")
        return role === "USER"
        
    }

    // USERS
    // retrieve all users
    static async getAllUsers(){
        const response = await axios.get(`${this.BASE_URL}/users/all`,{
            headers : this.getHeader() // adds the auth and content-type header
        })
        return response.data;
    }
    
    
    // get a user by id
    static async getUser(userId){
        const response = await axios.get(`${this.BASE_URL}/users/get-by-id/${userId}`,{
            headers : this.getHeader() // adds the auth and content-type header
        })
        return response.data;
    }

    static async getUserProfile(){
        const response = await axios.get(`${this.BASE_URL}/users/get-logged-in-profile-info`,{
            headers: this.getHeader()
        }
        )
        return response.data;
    }
    // get user bookings by id
    static async getUsersBookings(userId){
        
        const response = await axios.get(`${this.BASE_URL}/users/get-user-bookings/${userId}`,{
            headers : this.getHeader() // adds the auth and content-type header
        })
        return response.data;
    }

    // delete a user by id
    static async deleteUser(userId){
        const response = await axios.delete(`${this.BASE_URL}/users/delete/${userId}`,{
            headers : this.getHeader() // adds the auth and content-type header
        })
        return response.data;
    }
    // ROOMS 

    static async addRoom(formData){
        console.log(formData)
        
        const response = await axios.post(`${this.BASE_URL}/rooms/add`,formData,{
            headers : {
                ...this.getHeader(),
            "Content-type": "multipart/form-data"
            }
        })
        return response.data;
    }

    static async getAllRooms(){
        const response = await axios.get(`${this.BASE_URL}/rooms/all`)
        return response.data;
    }
    static async getAllAvailableRooms(){
        const response = await axios.get(`${this.BASE_URL}/rooms/all-available-rooms`)
        return response.data;
    }
    static async getAvailableRoomsByDateAndType(checkInDate, checkOutDate, roomType) {
        const result = await axios.get(
            `${this.BASE_URL}/rooms/available-rooms-by-date-and-type?checkInDate=${checkInDate}
		&checkOutDate=${checkOutDate}&roomType=${roomType}`
        )
        return result.data
    }
    static async getRoomsTypes(){
        const response = await axios.get(`${this.BASE_URL}/rooms/types`)
        return response.data;
    }
    static async getRoomById(roomId){
        const response = await axios.get(`${this.BASE_URL}/rooms/get-room-id/${roomId}`)
        return response.data;
    }
    static async updateRoom(roomId, formData){
        const response = await axios.put(`${this.BASE_URL}/rooms/update/${roomId}`,formData,{
            headers : {
                ...this.getHeader(),
            "Content-type": "multipart/form-data"
            }
            

        })
        return response.data;
    }
    static async deleteRoom(roomId){
        const response = await axios.delete(`${this.BASE_URL}/rooms/delete/${roomId}`,{
            headers : this.getHeader()

        })
        return response.data;
    }

    // BOOKINGS
    // save a booking
    static async bookRoom(bookingRequest, userId, roomId){
        const response = await axios.post(`${this.BASE_URL}/bookings/book-room/${roomId}/${userId}`, bookingRequest,{
            headers :this.getHeader()
        })
        return  response.data;
    }
    static async getAllBookings(){
        const response = await axios.get(`${this.BASE_URL}/bookings/all`,{
            headers :this.getHeader()
        })
        return  response.data;
    }

    
    static async getBookingByConfirmationCode(bookingCode){
        const response = await axios.get(`${this.BASE_URL}/bookings/get-by-confirmation-code/${bookingCode}`)
        return  response.data;
    }
    static async cancelBooking(bookingId){
        debugger;
        const response = await axios.delete(`${this.BASE_URL}/bookings/cancel/${bookingId}`,{
            headers: this.getHeader()
        })
        return  response.data;
    }

    static  isTokenExpired(token) {
        if (!token) return true;
    
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar el payload del JWT
        const exp = payload.exp * 1000; // Convertir a milisegundos
    
        return Date.now() >= exp; // Comparar con la fecha actual
    }

    
}
