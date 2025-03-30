import Navbar from './component/common/Navbar'
import Footer from './component/common/Footer'
import HomePage from './component/home/HomePage'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import AllRoomsPage from './component/bookings_rooms/AllRoomsPage'
import FindBookingPage from './component/bookings_rooms/FindBookingPage'
import RoomDetailsPage from './component/bookings_rooms/RoomDetailsPage'
import APIService from './service/APIService'
import LoginPage from './component/auth/LoginPage'
import RegisterPage from './component/auth/RegisterPage'
import ProfilePage from './component/profile/ProfilePage'
import EditProfilePage from './component/profile/EditProfilePage'
import { ProtectedRoute, AdminRoute } from './service/Guard.jsx'
import NotFoundPage from './component/common/NotFoundPage'
import ManageBookingPage from './component/admin/ManageBookingPage'
import ManageRoomPage from './component/admin/ManageRoomPage'
import AdminPage from './component/admin/AdminPage'
import AddRoomPage from './component/admin/AddRoomPage'
import EditRoomPage from './component/admin/EditRoomPage'
import EditBookingPage from './component/admin/EditBookingPage'
import { ToastContainer } from 'react-toastify'



function App() {
//APIService.login();
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar/>
        <div className="content">
          <ToastContainer />
          <Routes>
            {/* Public routes */}
            <Route exact path={"/home"} element={<HomePage/> }/>
            <Route exact path={"/"} element={<HomePage/> }/>
            <Route exact path="/rooms" element={<AllRoomsPage/> }/>
            <Route exact path="/find-bookings" element={<FindBookingPage/> }/>
            <Route exact path="/login" element={<LoginPage/> }/>
            <Route exact path="/register" element={<RegisterPage/> }/>
            
            {/* Protected routes */}
            {/* Protected Routes */}
            <Route path="/room-details-book/:roomId"
              element={<ProtectedRoute element={<RoomDetailsPage />} />}
            />
            <Route path="/profile"
              element={<ProtectedRoute element={<ProfilePage />} />}
            />
            <Route path="/edit-profile"
              element={<ProtectedRoute element={<EditProfilePage />} />}
            />

            {/* Admin routes */}
            <Route path="/admin"
              element={<AdminRoute element={<AdminPage />} />}
            />
            <Route path="/admin/manage-bookings"
              element={<AdminRoute element={<ManageBookingPage />} />}
            />
            <Route path="/admin/manage-rooms"
              element={<AdminRoute element={<ManageRoomPage/>} />}
            />
            <Route path="/admin/add-room"
              element={<AdminRoute element={<AddRoomPage/>} />}
            />
            <Route path="/admin/edit-room/:roomId"
              element={<AdminRoute element={<EditRoomPage/>} />}
            />
            <Route path="/admin/edit-booking/:bookingConfirmationCode"
              element={<AdminRoute element={<EditBookingPage/>} />}
            />
            {/* Not Found Wildcard */}
            <Route path="*"
              element={<NotFoundPage />} 
            />
          </Routes>
        </div>
        <Footer/>
      </div>
    </BrowserRouter>
    
  )
}

export default App
