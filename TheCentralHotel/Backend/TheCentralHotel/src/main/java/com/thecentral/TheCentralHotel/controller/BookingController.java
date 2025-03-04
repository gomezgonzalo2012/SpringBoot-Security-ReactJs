package com.thecentral.TheCentralHotel.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thecentral.TheCentralHotel.dto.ResponseDto;
import com.thecentral.TheCentralHotel.entity.Booking;
import com.thecentral.TheCentralHotel.service.interfaces.IBookingService;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/bookings")
@Tag(name="bookings")
public class BookingController {
    @Autowired
    IBookingService bookingService;

    @PostMapping("book-room/{roomId}/{userId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<?> saveBookings(@PathVariable String roomId, 
                                        @PathVariable String userId,
                                        @RequestBody Booking bookingRequest) {
        ResponseDto response = bookingService.saveBooking(Long.valueOf(roomId), Long.valueOf(userId), bookingRequest);
        
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @GetMapping("all")
    @PreAuthorize("hasAuthority('ADMIN')")// ejecuta previo al entrar al metodo
    public ResponseEntity<?> getAllBookings() {
        ResponseDto response = bookingService.getAllBookings();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("get-by-confirmation-code/{confirmationCode}")
    //@PreAuthorize("hasAuthority('ADMIN')")// ejecuta previo al entrar al metodo
    public ResponseEntity<?> getBookingByConfirmationCode(@PathVariable String confirmationCode) {
        ResponseDto response = bookingService.findByBookingConfirmationCode(confirmationCode);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @GetMapping("get-by-user-id/{userId}")
    public ResponseEntity<?> getUserBookings(@PathVariable Long userId) {
        ResponseDto response = bookingService.findByUserId(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    

    @DeleteMapping("cancel/{bookingId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")// ejecuta previo al entrar al metodo
    public ResponseEntity<?> cancelBooking(@PathVariable String bookingId) {
        ResponseDto response = bookingService.cancelBooking(Long.valueOf(bookingId));
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

}
