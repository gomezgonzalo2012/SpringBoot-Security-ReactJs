import { useState, useEffect } from "react"
import {useParams, useNavigate} from 'react-router-dom'
import APIService from "../../service/APIService"
import DatePicker from "react-datepicker"

const RoomDetailsPage = () =>  {
  const navigate = useNavigate();
  const {roomId} = useParams();
  const [roomDetails, setRoomDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [checkInDate, setCheckInDate] = useState(null)
  const [checkOutDate, setCheckOutDate] = useState(null)
  const [numOfAdults, setNumOfAdults] = useState(1)
  const [numOfChildren, setNumOfChildren] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalGuests, setTotalGuests] = useState(0)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [userId, setUserId] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')


  useEffect( () =>{
    const fetchData = async ()=>{
      try{
        setIsLoading(true)
        const response = await APIService.getRoomById(roomId)
        setRoomDetails(response.room)
        const userProfile = await APIService.getUserProfile()
        setUserId(userProfile.user.id)
      }catch(error){
        setError(error.response?.data?.message || error.message)
      }finally{
        setIsLoading(false)
      }
    };
    fetchData();

  },[roomId]  ) // se ejecuta cada vez que el roomId cambia

  //  Confirmacion de Booking 
  const handleConfirmBooking= async ()=>{
    if(!checkInDate || !checkOutDate){
      setErrorMessage("Please select check-in-date and check-out-date")
      setTimeout(()=> setErrorMessage(""), 5000)
      return;
    }
    if(isNaN(numOfAdults) || numOfAdults < 1|| isNaN(numOfChildren) || numOfChildren < 0){
      setErrorMessage("Please enter valid numbers for adults and children")
      setTimeout(()=> setErrorMessage(""), 5000)
      return ;
    }
    // Calculo de numero total de días

  const oneDay = 14 * 60 * 60 * 1000 // horas * minutos * segundo * millisegundos 
  const startDate = new Date(checkInDate) // convierte String a Date
  const endDate = new Date(checkOutDate)
  const totalDays = Math.round(Math.abs((endDate-startDate)/oneDay)+ 1)

  // calculo del numero total de invitados
  const calculateGuests = numOfAdults + numOfChildren

  // calculo de precio total
  const roomPricePerNight = roomDetails.roomPrice;
  const calculateTotalPrice = roomPricePerNight * totalDays;

  setTotalGuests(calculateGuests)
  setTotalPrice(calculateTotalPrice)
  }

  const acceptingBook = async ()=>{
    try {
      const startDate = new Date(checkInDate)
      const endDate = new Date(checkOutDate)

    // Log the original dates for debugging
      console.log("Original Check-in Date:", startDate);
      console.log("Original Check-out Date:", endDate);
    
    // Convert dates to YYYY-MM-DD format, adjusting for time zone differences
      const formattedCheckInDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const formattedCheckOutDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

      // Log the original dates for debugging
      console.log("Formated Check-in Date:", formattedCheckInDate);
      console.log("Formated Check-out Date:", formattedCheckOutDate);

    // Objeto booking

    const booking = {
      checkInDate : formattedCheckInDate,
      checkOutDate : formattedCheckOutDate,
      numOfAdults : numOfAdults,
      numOfChildren : numOfChildren
    }

    // peticion a la api para guardar booking
   
      const response = await APIService.bookRoom(booking, userId, roomId)
      if(response.statusCode === 200){
        setConfirmationCode(response.bookingConfirmationCode)
        setShowMessage(true) // mustra mensaje de confirmacions
        // despues de 5s de salvar el Booking redirije a rooms
        setTimeout(()=>{
          setShowMessage(false)
          navigate("/rooms")
        }, 5000)
      }
    
    } catch (error) {
      setError(error.response?.data?.message || error.message)
      setTimeout(()=> setError(""), 5000)
    }

  }

  if(isLoading) return <p className="room-detail-loading">Loading room details... </p>
  if(error) return <p className="room-detail-loading">{error} </p>
  if(!roomDetails) return <p className="room-detail-loading">Room not found </p>

  const { roomType, roomPrice, roomPhotoUrl, roomDescription, bookings } = roomDetails;
  

  return (
    <div className="room-details-booking">
      {showMessage && (
        <p className="booking-success-message">
          Booking successful! Confirmation code: {confirmationCode}. An SMS and email of your booking details have been sent to you.
        </p>
      )}
      {errorMessage && (
        <p className="error-message">
          {errorMessage}
        </p>
      )
      }
      <h2>Room Details</h2>
      <br />
      <img src={roomPhotoUrl} alt={roomType} className="room-details-image" />
      <div className="room-details-info">
        <h3>{roomType}</h3>
        <p>Price : $ {roomPrice} /nigth</p>
        <p>{roomDescription}</p>
      </div>
      {bookings && bookings.length > 0 && (
        <div>
          <h3>Existing Booking Details</h3>
          <ul className="booking-list">
            {bookings.map((booking, index) => (
              <li key={booking.id} className="booking-item">
                <span className="booking-number" >{index + 1}</span>
                <span className="booking-text" > Check-in: {booking.checkInDate}</span>
                <span className="booking-text" > Out: {booking.checkOutDate}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="booking-info">
        <button className="book-now-button" onClick={()=> setShowDatePicker(true)}>Book Now</button>
        <button className="go-back-button" onClick={()=> setShowDatePicker(false)}>Go Back</button>
        {showDatePicker && (
          <div className="date-picker-container">
            {/* check-in input */}
            <DatePicker
            className="detail-search-field"
            selected={checkInDate}
            onChange={(date)=> setCheckInDate(date)}
            selectsStart 
            minDate={new Date()}
            startDate={checkInDate}
            endDate={checkOutDate}
            placeholderText="Check-in Date"
            dateFormat={"dd/MM/yyyy"}
            //dateFormat={yyyy-MM-dd}
            />

            {/* check-out input */}
            <DatePicker
            className="detail-search-field"
            selected={checkOutDate}
            onChange={(date)=> setCheckOutDate(date)}
            selectsStart // comentar
            // Rango de fechas
            startDate={checkInDate}
            endDate={checkOutDate}
            minDate={checkInDate}
            // 
            placeholderText="Check-out Date"
            dateFormat={"dd/MM/yyyy"}
            //dateFormat={yyyy-MM-dd}
            />
            <div className="gues-container">
              <div className="guest-div">
                <label >Adults: </label>
                <input type="number"
                  min={1}// verificar
                  value={numOfAdults}
                  onChange={(e) => setNumOfAdults(parseInt(e.target.value))} />
              </div>
              <div className="guest-div">
                <label >Children: </label>
                <input type="number"
                  min={0}// verificar
                  value={numOfChildren}
                  onChange={(e) => setNumOfChildren(parseInt(e.target.value))} />
              </div>
              <button className="confirm-button" onClick={handleConfirmBooking}>Continue</button>
            </div>
          </div>
        )}
        {totalPrice > 0 &&(
          <div className="total-price">
            <p>Total Price {totalPrice}</p>
            <p>Total guests: {totalGuests}</p>
            <button onClick={acceptingBook} className="accept-booking">Accept Booking</button>
          </div>
        )}
      </div>
    </div>

  )
}

export default RoomDetailsPage