import React from 'react'
import APIService from '../../service/APIService'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toastSuccess, toastWarning } from '../../service/ToastService';


function AddRoomPage() {
    const MAXIMO_TAMANIO_BYTES = 500000; 
    const navigate = useNavigate()

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
    const [roomTypes, setRoomTypes] = useState([])
    const [newRoomType, setNewRoomType] = useState(false) // to create if the desired type doesn´t exist

    useEffect(()=>{
        const fetchRoomTypes = async ()=>{
            try {
                const response = await APIService.getRoomsTypes();
                setRoomTypes(response)
            } catch (error) {
                console.log("Error fetching room types: ", error.message);
                
            }
        }
        fetchRoomTypes();
    }, [])

    const handleChange = (e)=>{ // usefull for all Room inputs 
        const {name, value} = e.target;
        setRoomDetails( previousState =>({ // returns a new object . REMEMBER: we cannot change the state directly
            ...previousState,
            [name] : value
        }))
    }

    const handleRoomTypeChange = (e)=>{
        if(e.target.value === "new"){
            setNewRoomType(true)
            setRoomDetails( previousState =>({
                ...previousState,
                roomType : ""
            }))
        }else{
            setNewRoomType(false)
            setRoomDetails( previousState =>({
                ...previousState,
                roomType : e.target.value
            }))
        }
    }

    const handleFileChange = (e)=>{
        const selectedFile = e.target.files[0]
        
        if(selectedFile){
            const isOk = verifyFileSize(selectedFile)
            if(isOk){
                setFile(selectedFile)
                setImagePreview(URL.createObjectURL(selectedFile))
            }else{
                setFile(null)
                setImagePreview(null)
                e.target.value = "" // limpia el input (necesario)   
            }     
              
        }else{
            setFile(null)
            setImagePreview(null)
        }
    }
    const verifyFileSize=(file) =>{
        if (file.size > MAXIMO_TAMANIO_BYTES) {
            const tamanioEnMb = MAXIMO_TAMANIO_BYTES / 1000000;
            toastWarning(`El tamaño máximo es ${tamanioEnMb} MB`);
            return false;
        }else{
            return true;
        }

    }

    const addRoom = async ()=>{
        if(!roomDetails.roomType || !roomDetails.roomDescription || !roomDetails.roomPrice){
            setError("Please complete all fields")
            setTimeout(()=> setError(""), 5000)
            return
        }

        if(!window.confirm("Do you want to add this room?")){
            return
        }
        try {
            const formData = new FormData()
            formData.append("roomType", roomDetails.roomType)
            formData.append("roomPrice", roomDetails.roomPrice)
            formData.append("roomDescription", roomDetails.roomDescription)
            if(file){
                formData.append("photo", file)
            }

            const result = await APIService.addRoom(formData)
            if(result.statusCode === 200){
                toastSuccess("Room added successfully.")

                setTimeout(()=>{
                    setSuccess("")
                    navigate("/admin/manage-rooms")
                }, 3000)
            }
            
        }catch(error){
            setError(error.response?.data?.message || error.message)
            setTimeout(()=>setError(""), 3000)
        }
    }
  return (
    <div className="edit-room-container">
        <h2>Add Room</h2>
        {error && <p className='error-message'>{error}</p>}
        {success && <p className='success-message'>{success}</p>}
        <div className="edit-room-group">
            <div className="form-group">
                {imagePreview && (
                    <img src={imagePreview} alt="Image preview" className='room-photo-preview' />
                )}

                <input type="file"
                name='roomPhoto'
                onChange={handleFileChange} />

            </div>
            <div className="form-group">
                <label>Room type: </label>
                  <select value={roomDetails.roomType} onChange={handleRoomTypeChange}>
                      <option value=""> Select a room type</option>
                      {roomTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                      ))}
                      <option value="new">Other (please specify)</option>
                  </select>
                  {newRoomType && (
                      <input type='text'
                          name="roomType"
                          placeholder='Enter a new room type'
                          value={roomDetails.roomType}
                          onChange={handleChange} 
                        />
                  )}
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
            <button className ="update-button" onClick={addRoom}>Add Room</button>

        </div>
    </div>
  )
}

export default AddRoomPage