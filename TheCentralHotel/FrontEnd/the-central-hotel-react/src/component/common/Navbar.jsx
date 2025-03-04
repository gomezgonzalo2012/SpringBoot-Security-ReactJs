import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import APIService from "../../service/APIService";

const Navbar = () =>{
    const isAuthenticated = APIService.isAuthenticated();
    const isAdmin = APIService.isAdmin();
    const isUser = APIService.isUser();
    const navigate = useNavigate();
    
    const handleLogout =()=>{
        const isLogout = window.confirm("Are yu sure you want to log out?")
        if(isLogout){
            APIService.logOut();
            navigate('/home') 
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/home"> The Central Hotel</NavLink>

            </div>
            <ul className="navbar-ul">
                <li><NavLink to="/home" activeclass="active ">Home</NavLink></li>

                <li><NavLink to="/rooms" activeclass="active ">Rooms</NavLink></li>

                <li><NavLink to="/find-bookings" activeclass="active ">Find My Bookings</NavLink></li>

                {isUser && <li><NavLink to="/profile" activeclass="active ">Profile</NavLink></li>}

                {isAdmin && <li><NavLink to="/admin" activeclass="active ">Admin</NavLink></li>}

                {!isAuthenticated && <li><NavLink to="/login" activeclass="active ">Login</NavLink></li>}

                {!isAuthenticated &&  <li><NavLink to="/register" activeclass="active ">Register</NavLink></li>}

                {isAuthenticated && <li onClick={handleLogout}>Logout</li>}
                
            </ul>
        </nav>
    )
}

export default Navbar;