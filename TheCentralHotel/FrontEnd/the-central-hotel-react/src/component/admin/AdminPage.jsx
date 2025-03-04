import { useNavigate } from "react-router-dom";
import APIService from "../../service/APIService";
import { useEffect, useState } from "react";


const  AdminPage = ()=> {
    const [adminName, setAdminName] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate();
    

    useEffect(()=>{
        const fetchAdmin = async ()=>{
            try {
                const response = await APIService.getUserProfile();
                if(response.statusCode ===200) setAdminName(response.user.name)
            } catch (err) {
                setError(error.response?.data?.message || err.message)
                console.log("Error fetching admin details",err.message)
            }   
        }
        fetchAdmin();
    }, []);
  return (
    <div className="admin-page">
        <h1 className="welcome-message">Welcome, {adminName}</h1>
        <div className="admin-actions">
            <button className="admin-button" onClick={()=> navigate("/admin/manage-rooms")}>
                Manage Rooms
            </button>
            <button
            button className="admin-button" onClick={()=> navigate("/admin/manage-bookings")}>
                Manage Bookings
            </button>

        </div>
    </div>
  )
}

export default AdminPage