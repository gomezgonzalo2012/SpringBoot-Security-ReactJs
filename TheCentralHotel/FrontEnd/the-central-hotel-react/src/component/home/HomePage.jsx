import { useState } from "react";
import RoomSearch from "../common/RoomSearch";
import RoomResult from "../rooms/RoomResult";

const  HomePage = ()=>  {
    const [roomSearchResults ,setRoomSearchResults  ] = useState([])
    const handleSearchResult = (results)=>{
        setRoomSearchResults(results);
    }
    return (
      <div className="home">
        <section>
            <header className="header-banner">
                <img src="./assets/images/hotel.webp" alt="The Central Hotel image" className="header-image"/>
                <div className="overlay"></div>
                <div className="animated-texts overlay-content">
                    <h1>
                        Welcome to <span className="hotel-color"> The Central Hotel</span>
                    </h1>
                    <h3>Come and enjoy the paradise of relax.</h3>
                </div>
            </header>
        </section>
        {/* 
        search components
         */}
        <RoomSearch handleSearchResult = {handleSearchResult}></RoomSearch>
        <h4><a className="view-rooms-home" href="/rooms">All Rooms</a></h4>
        {/* Display al the rooms after search */}
        <RoomResult roomSearchResult={roomSearchResults}></RoomResult> 

        <h2 className="home-services"> Services at <span className="hotel-color"> The Central Hotel</span></h2>
        {/* Services Section */}
        <section className="service-section">
            <div className="service-card">
                <img src="./assets/images/ac.png" alt="Air conditioning" />
                <div className="service-details">
                    <h3 className="service-title"> Air Conditioning</h3>
                    <p className="service-description">Stay cool and comfortable throughout your stay with our individually controlled in-room air conditioning. </p>
                </div>
            </div>
            <div className="service-card">
                <img src="./assets/images/wifi.png" alt="Wifi" />
                <div className="service-details">
                    <h3 className="service-title"> Wifi</h3>
                    <p className="service-description">Stay cool and comfortable throughout your stay with our individually controlled in-room air conditioning. </p>
                </div>
            </div>
            <div className="service-card">
                <img src="./assets/images/minibar.png" alt="Mini Bar" />
                <div className="service-details">
                    <h3 className="service-title"> Mini Bar</h3>
                    <p className="service-description">Stay cool and comfortable throughout your stay with our individually controlled in-room air conditioning. </p>
                </div>
            </div>
            <div className="service-card">
                <img src="./assets/images/estacionamiento.png" alt="Parking" />
                <div className="service-details">
                    <h3 className="service-title"> Parking</h3>
                    <p className="service-description">Stay cool and comfortable throughout your stay with our individually controlled in-room air conditioning. </p>
                </div>
            </div>
        </section>
        <section>

        </section>
      </div>
    )
}

export default HomePage;