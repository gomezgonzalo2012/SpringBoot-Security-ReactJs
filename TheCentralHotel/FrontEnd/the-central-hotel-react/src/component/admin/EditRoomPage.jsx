import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import APIService from '../../service/APIService'

const EditRoomPage = () => {
    const {roomId} = useParams()
    const [roomDetails, setRoomDetails] = useState({
            roomPhotoUrl:"",
            roomType: "",
            roomPrice: "",
            roomDescription: ""
        })
    const [file, setFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchRoom = async()=>{
            try {
                const result = await APIService.getRoomById(roomId)
                const room = result.room
                setRoomDetails({
                    roomPhotoUrl:room.roomPhotoUrl,
                    roomType: room.roomType,
                    roomPrice: room.roomPrice,
                    roomDescription: room.roomDescription
                })
            } catch (error) {
                setError(error.response?.data?.message || error.message)
                setTimeout(()=>setError(""), 5000)
                console.log("Error retriving the Room", error.message)
            }
        }
        fetchRoom();
    }, [roomId])
    const handleFileChange = (e)=>{
        const selectedFile = e.target.files[0]
        if(selectedFile){
            setFile(selectedFile)
            setImagePreview(URL.createObjectURL(selectedFile))
        }else{
            setFile(null)
            setImagePreview(null)
        }
    }

    const handleChange = (e)=>{
        const {name, value} = e.target
        setRoomDetails(previousState=>({
            ...previousState,
            [name]:value,
        })
        )
    }
    const handleUpdateRoom = async ()=>{
        if(!window.confirm("Are you sure you want to update the room?")){
            return;
        }
        try {
            const formData = new FormData()
            formData.append("roomType",roomDetails.roomType)
            formData.append("roomPrice",roomDetails.roomPrice)
            formData.append("roomDescription",roomDetails.roomDescription)
            if(file){
                formData.append("photo",file)
            }
            
            const response = await APIService.updateRoom(roomId, formData)

            if(response.statusCode === 200){
                setSuccess("Room updated successfully ")
                setTimeout(()=> {
                    setSuccess("")
                    navigate("/admin/manage-rooms")
                },3000 )
            }

        } catch (error) {
            setError(error.response?.data?.message || error.message)
            setTimeout(()=> setError(""), 5000)
        }
    }
    const handleDeleteRoom = async ()=>{
        if(!window.confirm("Are you sure you want to delete the room?")){
            return;
        }
        try {
            const response = await APIService.deleteRoom(roomId)
            if(response.statusCode === 200){
                setSuccess("Room successfully deleted")
                setTimeout(()=> {
                    setSuccess("")
                    navigate("/admin/manage-rooms")
                },3000 )
            }

        } catch (error) {
            setError(error.response?.data?.message || error.message)
            setTimeout(()=> setError(""), 5000)
        }
    }
  return (
    <div className="edit-room-container">
        <h2>Edit Room</h2>
        {error && <p className='error-message'>{error}</p>}
        {success && <p className='success-message'>{success}</p>}
        <div className="edit-room-group">
            <div className="form-group">
                {imagePreview ? (
                    <img src={imagePreview} alt="Image preview" className='room-photo-preview' />
                ):(
                    roomDetails.roomPhotoUrl && (
                        <img src={roomDetails.roomPhotoUrl} alt={roomDetails.roomType} className='room-photo' />
                    )
                )
                }

                <input type="file"
                name='roomPhoto'
                onChange={handleFileChange} />

            </div>
              <div className="form-group">
                  <label>Room type: </label>
                  <input type='text'
                      name="roomType"
                      value={roomDetails.roomType}
                      onChange={handleChange}
                  />
              </div>
            <div className="form-group">
                <label >Room price</label>
                <input type="text"
                name='roomPrice'
                value={roomDetails.roomPrice}
                onChange={handleChange} />
            </div>
            <div className="form-group">
                <label >Room Description</label>
                <textarea type="text"
                name='roomDescription'
                value={roomDetails.roomDescription}
                onChange={handleChange} />
            </div>
            <button className ="update-button" onClick={handleUpdateRoom}>Update Room</button>
            <button className ="delete-button" onClick={handleDeleteRoom}>Delete Room</button>

        </div>
    </div>
  )
}

export default EditRoomPage