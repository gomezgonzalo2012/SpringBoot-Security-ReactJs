import { useState, useEffect } from "react"
import APIService from "../../service/APIService"
import Pagination from "../common/Pagination"
import RoomSearch from "../common/RoomSearch";
import RoomResult from "../rooms/RoomResult";

function AllRoomsPage() {
    const [rooms, setRooms] = useState([])
    const [filteredRooms, setFilteredRooms] = useState([])
    const [roomTypes, setRoomTypes] = useState([])
    const [selectedRoomType, setSelectedRoomTypes] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [roomsPerPage] = useState(2)

    //
    const handleSearchResult = (results)=>{
        setRooms(results)
        setFilteredRooms(results)
    }

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
        setSelectedRoomTypes(e.target.value)
        filterRooms(e.target.value)
    }
    const filterRooms = (type)=>{
        if(type === ''){
            setFilteredRooms(rooms)
        }else{
            const filtered = rooms.filter((room)=> room.roomType === type) 
            setFilteredRooms(filtered)
        }
        setCurrentPage(1); // reset to first page after filtering
    }

    //   Pagination  
    const indexOfLastRoom = currentPage * roomsPerPage;
    console.log("indexOfLastRoom: ", indexOfLastRoom)

    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    console.log("indexOfFirstRoom: ", indexOfFirstRoom)

    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
    console.log("current rooms: ", currentRooms)
    console.log("current page: ", currentPage)
    console.log("fleteres rooms: ", filteredRooms)


    const paginate = (pageNumber) => setCurrentPage(pageNumber)
  return (
    <div className="all-rooms">
        <h2>All Rooms</h2>
        <div className="all-room-filter-div">
            <label > Select by Room Type:</label>
            <select value={selectedRoomType} onChange={handleRoomTypeChange}>
                <option value=''>All</option>
                {roomTypes.map(type=>(
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
        </div>
        <RoomSearch handleSearchResult={handleSearchResult}/>
        <RoomResult roomSearchResult={currentRooms}/>

        <Pagination 
        roomsPerPage={roomsPerPage}
        totalRooms={filteredRooms.length}
        currentPage={currentPage}
        paginate={paginate}/>
    </div>
  )
}

export default AllRoomsPage