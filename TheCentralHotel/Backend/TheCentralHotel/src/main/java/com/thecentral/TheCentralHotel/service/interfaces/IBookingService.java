package com.thecentral.TheCentralHotel.service.interfaces;

import com.thecentral.TheCentralHotel.dto.ResponseDto;
import com.thecentral.TheCentralHotel.entity.Booking;

public interface IBookingService {
    ResponseDto saveBooking(Long roomId, Long userId, Booking bookingRequest);
    ResponseDto getAllBookings();
    ResponseDto cancelBooking(Long bookingId);
    ResponseDto findByBookingConfirmationCode(String confirmationCode);
    ResponseDto findByUserId(Long userId);
}
