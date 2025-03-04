package com.thecentral.TheCentralHotel.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thecentral.TheCentralHotel.entity.Booking;
import java.util.List;
import java.util.Optional;


public interface BookingRepository extends JpaRepository<Booking, Long>{

    List<Booking> findByRoomId(Long id);
    Optional<Booking> findByBookingConfirmationCode(String confirmationCode);
    List<Booking> findByUserId(Long userId);
    
} 
