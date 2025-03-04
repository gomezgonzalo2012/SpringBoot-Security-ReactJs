import React from 'react'
import { useNavigate } from 'react-router-dom'
import APIService from "../../service/APIService"

const RoomResult= ({roomSearchResult})=> {
  const navigate = useNavigate(); // hook
  const isAdmin = APIService.isAdmin();
  return (
    <section className="room-resuls">
      {roomSearchResult && roomSearchResult.length > 0 && 
      (<div className='room-list'>
        {roomSearchResult.map(room=>(
          <div key={room.id} className='room-list-item'>
            <img src={room.roomPhotoUrl} className='room-list-item-image' alt={room.roomType} />
            <div className='room-details'>
              <h3>{room.roomType}</h3>
              <p>Price : ${room.roomPrice}</p>
              <p>Description : {room.roomDescription}</p>
            </div>
            <div className='book-now-div'>
              {isAdmin? ( // edicion de Room solo para admin
                <button className='edit-room-button' 
                onClick={()=> navigate(`/admin/edit-room/${room.id}`)}>
                  Edit Room
                </button>
              ) :( // booking a room
                <button className='book-now-button' 
                onClick={()=> navigate(`/room-details-book/${room.id}`)}>
                  View/Book Room
                </button>
              )
              }
            </div>
          </div>
        ))}
      </div>)
      }
    </section>
  )
}

export default RoomResult