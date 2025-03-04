package com.thecentral.TheCentralHotel.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.thecentral.TheCentralHotel.dto.BookingDto;
import com.thecentral.TheCentralHotel.dto.ResponseDto;
import com.thecentral.TheCentralHotel.entity.Booking;
import com.thecentral.TheCentralHotel.entity.Room;
import com.thecentral.TheCentralHotel.entity.User;
import com.thecentral.TheCentralHotel.exception.OurException;
import com.thecentral.TheCentralHotel.repository.BookingRepository;
import com.thecentral.TheCentralHotel.repository.RoomRepository;
import com.thecentral.TheCentralHotel.repository.UserRepository;
import com.thecentral.TheCentralHotel.service.interfaces.IBookingService;
import com.thecentral.TheCentralHotel.utils.Utils;

@Service
public class BookingService implements IBookingService{
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public ResponseDto saveBooking(Long roomId, Long userId, Booking bookingRequest) {
        ResponseDto response = new ResponseDto();
        try {
            if(bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())){
                throw new IllegalArgumentException("Check in date must be before check out date");
            }
            Room room = roomRepository.findById(roomId).orElseThrow(()-> new OurException("Room not found"));
            User user = userRepository.findById(userId).orElseThrow(()-> new OurException("Room not found"));
            
            List<Booking> existingBookings = room.getBookings();

            if(!roomIsAvailable(bookingRequest, existingBookings)){
                            throw new OurException("Room is not available for selected date range");}
                bookingRequest.setUser(user);
                bookingRequest.setRoom(room);
                // generamos el ConfirmationCode
                String bookingCode = Utils.generateRandomAlphanumeric(10);
                bookingRequest.setBookingConfirmationCode(bookingCode);
                bookingRepository.save(bookingRequest);
                response.setStatusCode(200);
                response.setMessage("successful");
                response.setBookingConfirmationCode(bookingCode);

            
        } catch (OurException ex) {
            response.setStatusCode(404);
            response.setMessage(ex.getMessage());
        }catch (Exception ex) {
            response.setStatusCode(500);
            response.setMessage("Error saving the booking: "+ ex.getMessage());
        }
        return response;
    }
            
    
            
    @Override
    public ResponseDto getAllBookings() {
        ResponseDto response = new ResponseDto();
        try {
            List<Booking> bookingList= bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
            List<BookingDto> bookingDtoList = Utils.mapBookingListToBookingDtoList(bookingList);
            response.setBookingList(bookingDtoList);
            response.setStatusCode(200);
            response.setMessage("successful");

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error retriving bookings");
        }
        return response;
    }

    @Override
    public ResponseDto cancelBooking(Long bookingId) {
        ResponseDto response = new ResponseDto();
        try {
            Booking booking = bookingRepository.findById(bookingId).orElseThrow(()->new OurException("Booking does Not Exists"));
            bookingRepository.deleteById(booking.getId());
            response.setStatusCode(200);
            response.setMessage("successful");

        }catch (OurException ex) {
            response.setStatusCode(404);
            response.setMessage(ex.getMessage());
        }catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error canceling the booking");
        }
        return response;
    }

    @Override
    public ResponseDto findByBookingConfirmationCode(String confirmationCode) {
        ResponseDto response = new ResponseDto();
        try {
            Booking booking = bookingRepository.findByBookingConfirmationCode(confirmationCode)
                                    .orElseThrow(()-> new OurException("Booking not found with code "+confirmationCode));
            BookingDto bookingDto = Utils.mapBookingEntityToBookingDtoWithBookedRooms(booking, true);
            response.setBooking(bookingDto);
            response.setStatusCode(200);
            response.setMessage("successful");

            
        } catch (OurException ex) {
            response.setStatusCode(404);
            response.setMessage(ex.getMessage());
        }catch (Exception ex) {
            response.setStatusCode(500);
            response.setMessage("Error finding the booking");
        }
        return response;
    }

    @Override
    public ResponseDto findByUserId(Long userId) {
        ResponseDto response = new ResponseDto();
        try {
            List<Booking> bookingList = bookingRepository.findByUserId(userId);
            List<BookingDto> bookingDtoList  = Utils.mapBookingListToBookingDtoList(bookingList);
            response.setBookingList(bookingDtoList);
            response.setStatusCode(200);
            response.setMessage("successful");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error retriving the bookings");
        }
        return response;
    }
    private boolean roomIsAvailable(Booking bookingRequest, List<Booking> existingBookings) {
        return existingBookings.stream()
        .noneMatch(existingBooking ->
                // bookingRequest.getCheckInDate().equals(existingBooking.getCheckInDate())
                //         || bookingRequest.getCheckOutDate().isBefore(existingBooking.getCheckOutDate())
                //         || (bookingRequest.getCheckInDate().isAfter(existingBooking.getCheckInDate())
                //         && bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate()))
                //         || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())

                //         && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckOutDate()))
                //         || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())

                //         && bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckOutDate()))

                //         || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                //         && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckInDate()))

                //         || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                //         && bookingRequest.getCheckOutDate().equals(bookingRequest.getCheckInDate()))
                        // alternativa de interseccion de rangos:
                        bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate()) &&
                       bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckInDate())
        );
    }
    
}
