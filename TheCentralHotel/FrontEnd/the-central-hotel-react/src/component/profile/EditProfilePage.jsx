import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import APIService from '../../service/APIService'

const EditProfilePage =()=> {
    const [user, setUser] = useState(null)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchUser = async ()=>{
            try{
                const response = await APIService.getUserProfile()
                setUser(response.user)
            }catch(err){
                setError(error.message);
            }
        }
        fetchUser();
    },[])

    const handleDeleteProfile=async()=>{
        try {
            if(!window.confirm("Are you sure you want to delete your Account?")){
                return;
            }
            const response = await APIService.deleteUser(user.id)
            if(response.statusCode === 200){
                APIService.logOut()
              navigate("/register")
            }
        } catch (error) {
            setError(error.message)
        }
    }
  return (
    <div className="edit-profile-page">
        <h2>Edit profile</h2>
        {error && <p className='error-message'>{error}</p>}
        {user && (
                <div className="profile-details">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
                    <button className="delete-profile-button" onClick={handleDeleteProfile}>Delete Profile</button>
                </div>
            )}
    </div>
  )
}

export default EditProfilePage