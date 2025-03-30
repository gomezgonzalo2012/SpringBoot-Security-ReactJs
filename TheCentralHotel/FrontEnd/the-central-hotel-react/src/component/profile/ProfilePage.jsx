import React, { useEffect, useState } from 'react'
import APIService from '../../service/APIService'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
const navigate = useNavigate()
const [user, setUser] = useState(null)
const [error, setError] = useState("")

useEffect(()=>{
  const fetchUserProfile= async ()=>{
    try {
      const response = await APIService.getUserProfile();
      if(response.user){
        const userWithBookings = await APIService.getUsersBookings(response.user.id)
        setUser(userWithBookings.user)
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }

  }
  fetchUserProfile();
}, [])
const handleLogOut = ()=>{
  APIService.logOut()
  navigate("/home")
}
const handleEditProfile= ()=>{
  navigate("/edit-profile")
}
  return (
    <div className='profile-page'>
      {user && <h2>Welcolme {user.name}</h2>}
      <div className="profile-actions">
        <button className='edit-profile-button' onClick={handleEditProfile}> Edit profile</button>
        <button className='logOut-button' onClick={handleLogOut}>Logout</button>
      </div>
      {error && <p className='error-message'>{error}</p>}
      {user && (
        <div className="profile-details">
          <h3>My Profile details</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
        </div>
      )}
      <div className="bookings-section">
        <h3>My Booking History</h3>
        <div className='booking-list'>
          {user && user.bookings.length> 0 ? (
            user.bookings.map(booking=>(
              <div key={booking.id} className="booking-item">
                <p><strong>Booking Code:</strong> {booking.bookingConfigurationCode}</p>
                <p><strong>Check-in Date:</strong> {booking.checkInDate}</p>
                <p><strong>Check-out Date:</strong> {booking.checkOutDate}</p>
                <p><strong>Total Guests:</strong> {booking.numOfGuests}</p>
                <p><strong>Room Type:</strong> {booking.room.roomType}</p>
                <img src={booking.room.roomPhotoUrl} alt="Room" className="room-photo" />
              </div>
            ))
          ):(
            <p>No bookings found. </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage