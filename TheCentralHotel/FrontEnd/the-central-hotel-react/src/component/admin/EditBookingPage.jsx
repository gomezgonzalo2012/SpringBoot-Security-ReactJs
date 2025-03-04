import React, { useEffect, useState } from 'react'
import APIService from '../../service/APIService'
import { useNavigate, useParams } from 'react-router-dom'

const EditBookingPage =()=> {
    const [bookingDetails, setBookingDetails] = useState(null)
    const {bookingConfirmationCode} = useParams()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchBooking = async()=>{
            try {
                const response = await APIService.getBookingByConfirmationCode(bookingConfirmationCode)
                setBookingDetails(response.booking)
            } catch (error) {
                setError(error.response?.data?.message || error.message)
                setTimeout(()=>setError(""), 5000)
                console.log("Error retriving the booking", error.message)
            }
        } 
        fetchBooking();
    }, [bookingConfirmationCode])

    const archiveBooking= async (bookingId)=>{
        if(!window.confirm("Are you sure you want to archive this Booking?")){
            return;
        }
        if(bookingId){
            try {
                const response = await APIService.cancelBooking(bookingId)
                if(response.statusCode === 200){
                    setSuccess("The booking was successfully archieved")
                    setTimeout(()=>{
                        setSuccess("")
                        navigate("/admin/manage-bookings")
                    }, 3000)
                }
            } catch (error) {
                setError(error.response?.data?.message || error.message)
                setTimeout(()=>setError(""), 5000)
                console.log("Error canceling the booking", error.message)
            }
        }
    }
  return (
    <div className="find-booking-page">
        <h2>Booking Details</h2>
        {error && <p className='error-message'>{error}</p>}
        {success && <p className='success-message'>{success}</p>}
        {bookingDetails &&(
            <div className="booking-details">
            <h3>Booking Details </h3>
            <p>Confirmation Code: {bookingDetails.bookingConfigurationCode}</p>
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
                <p>Room price: {bookingDetails.room.roomPrice}</p>
                <p>Room description: {bookingDetails.room.roomDescription}</p>
                <img src={bookingDetails.room.roomPhotoUrl} alt={bookingDetails.room.roomType} />
            </div>
            <button className='acheive-booking' onClick={()=>archiveBooking(bookingDetails.id)}>Archive Booking</button>
        </div>
        )}
    </div>
  )
}

export default EditBookingPage