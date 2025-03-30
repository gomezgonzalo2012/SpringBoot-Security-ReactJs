import { useState, useEffect } from "react"
import APIService from "../../service/APIService"
import Pagination from "../common/Pagination"
import RoomSearch from "../common/RoomSearch";
import RoomResult from "../rooms/RoomResult";
import RoomTypeSelect from "../common/RoomTypeSelect";

function AllRoomsPage() {
    const [rooms, setRooms] = useState([])
    const [filteredRooms, setFilteredRooms] = useState([])
    const [roomTypes, setRoomTypes] = useState([])
    const [selectedRoomType, setSelectedRoomTypes] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [roomsPerPage] = useState(5)

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
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
    


    const paginate = (pageNumber) => setCurrentPage(pageNumber)
  return (
    <div className="all-rooms">
        <h2>All Rooms</h2>
        <div className="all-room-filter-div">
            <RoomTypeSelect  
                roomTypes={roomTypes} 
                selectedRoomType={selectedRoomType} 
                onChange={handleRoomTypeChange}
            />
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