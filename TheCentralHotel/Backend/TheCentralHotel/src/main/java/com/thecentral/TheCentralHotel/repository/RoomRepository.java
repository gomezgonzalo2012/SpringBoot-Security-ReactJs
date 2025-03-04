package com.thecentral.TheCentralHotel.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thecentral.TheCentralHotel.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {

    // @Query(value = "SELECT DISTINCT roomType FROM room", nativeQuery = true) SQL Nativo

    @Query("SELECT DISTINCT r.roomType from Room r") // JPQL (Java Persistence Query Language)
    List<String> findDistincRoomTypes();

    @Query(value = "SELECT * FROM rooms r WHERE r.id NOT IN (SELECT b.room_id FROM bookings b)", nativeQuery=true)
    List<Room> getAllAvailableRooms();

    // buscar habitaciones disponibles mediante su CheckinDate, ChackoutDate y roomType
    /*
     * select r from rooms r where r.id not in
     * (SELECT b.roomid from bookings 
     * where b.checkindate >= @checkout and b.checkoutdate =< @checkin) and r.roomtype LIKE= %roomType%
     */
    @Query("SELECT r FROM Room r WHERE r.roomType LIKE %:roomType% AND r.id"+ 
            " NOT IN (SELECT bk.room.id FROM Booking bk WHERE (bk.checkInDate <= :checkOutDate) AND (bk.checkOutDate >= :checkInDate))")
     List<Room> findAvailableRoomsByDatesAndTypes(LocalDate checkInDate,LocalDate checkOutDate, String roomType);
}
