import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import APIService from "../../service/APIService"
import Pagination from '../common/Pagination'

const ManageBookingPage = () => {
  const [bookings, setBookigs] = useState([])
  const [filteredBookings, setFilteredBookigs] = useState([])
  const [searchTerm, setSearchTerm] = useState("") // for searching by boookingConfirmationCode
  const [currentPage, setCurrentPage] = useState(1)
  const [bookingsPerPage] = useState(6)
  const navigate = useNavigate()

  useEffect(()=>{
    const fetchBookings = async ()=>{
      try{
        const response = await APIService.getAllBookings()
        const bookingList = response.bookingList
        console.log("bookings = ",bookingList)
        setBookigs(bookingList)
        setFilteredBookigs(bookingList)
      }catch(err){
        console.log("Error retrivin the bookins: ", err.message)
      }
      
    }
    fetchBookings();
  }, [])

  useEffect(()=>{
    filterBookings(searchTerm)
  }, [searchTerm, bookings]);

  const filterBookings = (term) => {
    if (term === "") {
      console.log("bookings :",bookings)
      setFilteredBookigs(bookings)
    } else {
      const filtered = bookings.filter((booking) => (
        booking.bookingConfigurationCode && booking.bookingConfigurationCode.toLowerCase().includes(term.toLowerCase())
      ))
      setFilteredBookigs(filtered)
    }
    setCurrentPage(1)
  }

  const handleSearchTermChange=(e)=>{
    setSearchTerm(e.target.value)
  }

    const indexOfLastBooking = currentPage * bookingsPerPage;

    const indexOfFirstRoom = indexOfLastBooking - bookingsPerPage;

    const currentBookings = filteredBookings.slice(indexOfFirstRoom, indexOfLastBooking);
    
    const paginate = (pageNumber) => setCurrentPage(pageNumber)
  return (
    <div className="booking-container">
      <h2>All Bookings</h2>
      <div className="search-div">
        <label > Search by Booking code: </label>
        <input type="text" 
        value={searchTerm}
        onChange={handleSearchTermChange}
        placeholder='Enter booking code'/>
      </div>

      <div className="booking-results">
        {currentBookings.map((booking)=>(
          <div key={booking.id} className="booking-result-item">
            <p><strong>Booking code:</strong> {booking.bookingConfigurationCode}</p>
            <p><strong>Check-in date</strong> {booking.checkInDate}</p>
            <p><strong>Check-out date</strong> {booking.checkOutDate}</p>
            <p><strong>Total guests:</strong> {booking.numOfGuests}</p>
            <button className='edit-room-button'
              onClick={()=>navigate(`/admin/edit-booking/${booking.bookingConfigurationCode}`)}>
                Manage Booking
            </button>
          </div>
        ))}
      </div>
      <Pagination
      currentPage={currentPage}
      totalRooms={filteredBookings.length}
      roomsPerPage={bookingsPerPage}
      paginate={paginate}></Pagination>
    </div>
  )
}

export default ManageBookingPage