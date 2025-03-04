import { useState } from "react"
import APIService from "../../service/APIService"


const  FindBookingPage = () => {

    const [confirmationCode, setConfirmationCode] = useState("") // codigo ingresado por el usuario
    const [bookingDetails, setBookingDetails] = useState(null) // detalles del booking obtenido por codigo
    const [error, setError] = useState(null) // maneja cualquier error

    const handleSearch = async ()=>{
        if(!confirmationCode.trim()){
            setError("Please enter a booking confirmation code.")
            setTimeout(()=> setError(""), 5000)
        }
        try{

            const response = await APIService.getBookingByConfirmationCode(confirmationCode) // llamada a la API
            setBookingDetails(response.booking)
            
        }catch(error){
            setError(error.response?.data?.message || error.message)
            setTimeout(()=>setError(""), 5000)
        }
    }
  return (
    <div className="find-booking-page">
        <h2>Find Booking</h2>
        <div className="search-container">
            <input 
            required
            type="text" 
            placeholder="Enter your booking confirmation code"
            value={confirmationCode}
            onChange={(e)=> setConfirmationCode(e.target.value)}
            />
            <button onClick={handleSearch}>Find</button>
        </div>
        {/* si existe error lo muestra */}
        {error && <p style={{color:'red'}}>{error}</p>} 
        {/* Si exite bookigDerails lo muestra */}
        {bookingDetails && (
            <div className="booking-details">
                <h3>Booking Details </h3>
                <p>Confirmation Code: {bookingDetails.confirmationCode}</p>
                <p>Check-in Date: {bookingDetails.checkInDate}</p>
                <p>Check-out Date: {bookingDetails.checkOutDate}</p>
                <p>Num of Adults: {bookingDetails.numOfAdults}</p>
                <p>Num of Children: {bookingDetails.numOfChildren}</p>
                <br />
                <hr />
                <br />
                <h3>Booker Details</h3>
                <div>
                    <p>Name: {bookingDetails.user.name}</p>
                    <p>Email: {bookingDetails.user.email}</p>
                    <p>Phone Number: {bookingDetails.user.phoneNumber}</p>
                </div>
                <br />
                <hr />
                <br />
                <h3>Room Details</h3>
                <div>
                    <p>Room Type: {bookingDetails.room.roomType}</p>
                    <img src={bookingDetails.room.roomPhotoUrl} alt={bookingDetails.room.roomType} />
                </div>
            </div>
        )}
    </div>
  )
}

export default FindBookingPage
