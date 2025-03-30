import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import APIService from "../../service/APIService"
import RoomTypeSelect from "./RoomTypeSelect"

const RoomSearch =({handleSearchResult})=> {
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [roomType, setRoomType] = useState(null)
    const [roomTypes, setRoomTypes] = useState([]) // lista traida del back
    const [error, setError] = useState("") 

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const types = await APIService.getRoomsTypes();
                console.log(types)
                setRoomTypes(types)

            } catch (error) {
                console.log(error.message);

            }
        }
        fetchRoomTypes();// ???
    }, [])
    
    const showError=(message , timeOut = 3000)=>{
        setError(message);
        setTimeout(()=>{
            setError(""); // limpia error despues de 3000 ms
        }, timeOut)
    }

    
    const handleInternalSearch = async ()=>{
        if( !startDate || !endDate || !roomType){ // si no hay almenos 1 campo
            showError("Please select all fields")
            return false;
        }
        try {
            // remueve la hora, tomandosolo lo que hay antes de 
            //T : 2017-10-19T16:00:00.000Z [0]=> '2017-10-19' [1]=> 'T16:00:00.000Z'
            const sDate  = startDate.toISOString()
            const eDate = endDate.toISOString()
            const formatedStartDate = sDate? sDate.split('T')[0] : null;
            const formatedEndate = eDate ? eDate.split('T')[0] : null;

            const response = await APIService.getAvailableRoomsByDateAndType(formatedStartDate,formatedEndate, roomType )
            
            if(response.statusCode === 200){
                if(response.roomList.length<=0){
                    showError("Room Not Currently Available for the date range and room type")
                }
                handleSearchResult(response.roomList) // pasamos la lista a la funcion pasada por el padre HomePage
                                                    // la funcion ejecuta setRoomSearchResults()
                //setError('')
            }
        } catch (error) {
            showError("Unown error occured: " + error.message)
        }
    }
  return (
    <section>
        <div className="search-container">
        <div className="search-field">
                <label > Check-in Date</label>
                <DatePicker
                    selected={startDate}
                    onChange = {(date) => setStartDate(date)}
                    dateFormat= "dd/MM/yyyy"
                    placeholderText="Select Check-in Date"
                    minDate={new Date()} // fecha minima
                />
            </div>
            <div className="search-field">
                <label > Check-out Date</label>
                <DatePicker
                    selected={endDate}
                    onChange = {(date) => setEndDate(date)}
                    dateFormat= "dd/MM/yyyy"
                    placeholderText="Select Check-out Date"
                    minDate={startDate} // minimo startDate
                />
            </div>
            <div className="search-field">
                <RoomTypeSelect  
                    roomTypes={roomTypes} 
                    selectedRoomType={roomType} 
                    onChange={(e)=>setRoomType(e.target.value)}
                />
            </div>
            <button className="home-search-button" onClick={handleInternalSearch}>
                    SearchRooms
            </button>
        </div>
        {error && <p className="error-message">{error}</p>}
    </section>
  )
}

export default RoomSearch;