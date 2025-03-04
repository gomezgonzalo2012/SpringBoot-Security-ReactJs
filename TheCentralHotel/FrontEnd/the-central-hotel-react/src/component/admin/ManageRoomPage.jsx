import React, { useState, useEffect } from 'react'
import RoomResult from '../rooms/RoomResult'
import Pagination from '../common/Pagination'
import APIService from '../../service/APIService'
import { useNavigate } from 'react-router-dom'

const  ManageRoomPage= ()=> {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([])
    const [roomTypes, setRoomTypes] = useState([])
    const [filteredRooms, setFilteredRooms] = useState([])
    const [selectedRoomType, setSelecteRoomType] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [roomsPerPage, setRoomsPerPage ] = useState(5)
    useEffect(()=>{
            const fetchRooms = async () => {
                try {
                    const response = await APIService.getAllRooms()
                    const allRooms = response.roomList;
                    console.log("all rooms: ", allRooms)
                    setRooms(allRooms);
                    setFilteredRooms(allRooms);
                } catch (error) {
                    console.log('Error fetching rooms: ', error.message)
                }
            };
            const fetchRoomTypes = async () => {
                try {
                    const types = await APIService.getRoomsTypes()
                    setRoomTypes(types);
                } catch (error) {
                    console.log('Error fetching room types: ', error.message)
                }
            }
            fetchRooms();
            fetchRoomTypes();
        },[] )
    const handleRoomTypeChange = (e)=>{
        setSelecteRoomType(e.target.value)
        filterRooms(e.target.value)
    }
    const filterRooms = async (type)=>{
        if(type === ""){
            setFilteredRooms(rooms)
        }else{
            const filteredRooms = rooms.filter(room=>room.roomType === type)
            setFilteredRooms(filteredRooms);
        }
        setCurrentPage(1); // resetea luego de filtrar 
    }

    const indexOfLastRoom = currentPage * roomsPerPage;

    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;

    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
    
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="all-rooms">
        <h2>All Rooms</h2>
        <div className="all-room-filter-div"
            style={{display:'flex', justifyContent:"space-between", alignItems:"center"}}>
            <div className="filter-select-div">
                <label> Filter by Room Type: </label>
                <select value={selectedRoomType} onChange={handleRoomTypeChange}>
                    <option value="">All</option>
                    {roomTypes.map((type)=>(
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
                <button className='add-room-button' onClick={()=> navigate("/admin/add-room")}>
                    Add Room
                </button>
            </div>
        </div>
        <RoomResult roomSearchResult={currentRooms}></RoomResult>
          <Pagination
              roomsPerPage={roomsPerPage}
              totalRooms={filteredRooms.length}
              currentPage={currentPage}
              paginate={paginate}></Pagination>
    </div>
  )
}

export default ManageRoomPage