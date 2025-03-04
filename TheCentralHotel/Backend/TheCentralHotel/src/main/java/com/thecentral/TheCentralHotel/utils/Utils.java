package com.thecentral.TheCentralHotel.utils;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

import com.thecentral.TheCentralHotel.dto.BookingDto;
import com.thecentral.TheCentralHotel.dto.RoomDto;
import com.thecentral.TheCentralHotel.dto.UserDto;
import com.thecentral.TheCentralHotel.entity.Booking;
import com.thecentral.TheCentralHotel.entity.Room;
import com.thecentral.TheCentralHotel.entity.User;

public class Utils {
    private static final String ALPHANUMERIC_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private static final SecureRandom secureRandom = new SecureRandom();

    public static String generateRandomAlphanumeric(int lenght){ // genera un codigo andom usando el ALPHANUMERIC_STRING
        StringBuilder stringBuilder = new StringBuilder();
        for(int i = 0; i< lenght; i++){
            int randomIndex = secureRandom.nextInt(ALPHANUMERIC_STRING.length()); // obtiene un valor de indice random 
            char randomCharacter= ALPHANUMERIC_STRING.charAt(randomIndex);
            stringBuilder.append(randomCharacter);
        }
        return stringBuilder.toString();
    }

    public static UserDto mapUserEntityToUserDto(User user){
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setName(user.getName());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setRole(user.getRole());
        return userDto;
    }
    public static RoomDto mapRoomEntityToRoomDto(Room room){
        RoomDto roomDto = new RoomDto();
        // Map simple fields
        roomDto.setId(room.getId());
        roomDto.setRoomDescription(room.getRoomDescription());
        roomDto.setRoomPhotoUrl(room.getRoomPhotoUrl());
        roomDto.setRoomPrice(room.getRoomPrice());
        roomDto.setRoomType(room.getRoomType());
        return roomDto;
    }
    public static BookingDto mapBookingEntityToBookingDto(Booking booking) {
        BookingDto bookingDto = new BookingDto();
        // Map simple fields
        bookingDto.setCheckInDate(booking.getCheckInDate());
        bookingDto.setCheckOutDate(booking.getCheckOutDate());
        bookingDto.setId(booking.getId());
        bookingDto.setNumOfAdults(booking.getNumOfAdults());
        bookingDto.setNumOfChildren(booking.getNumOfChildren());
        bookingDto.setNumOfGuests(booking.getNumOfGuests());
        bookingDto.setBookingConfigurationCode(booking.getBookingConfirmationCode());
        return bookingDto;
    }
    public static UserDto mapUserEntityToUserDtoWithBookingAndRoom(User user){
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setName(user.getName());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setRole(user.getRole());
        if(!user.getBookings().isEmpty()){
            userDto.setBookings(user.getBookings().stream().map(booking ->
            mapBookingEntityToBookingDtoWithBookedRooms(booking, false)).collect(Collectors.toList()));
        }
        return userDto;
    }

    public static RoomDto mapRoomEntityToRoomDtowithBooking(Room room){
        RoomDto roomDto = new RoomDto();
        roomDto.setId(room.getId());
        roomDto.setRoomDescription(room.getRoomDescription());
        roomDto.setRoomPhotoUrl(room.getRoomPhotoUrl());
        roomDto.setRoomPrice(room.getRoomPrice());
        roomDto.setRoomType(room.getRoomType());
        // roomDto.setBookings(room.getBookings().stream().map(booking -> mapBookingEntityToBookingDTO(booking)).collect(Collectors.toList()));
        roomDto.setBookings(room.getBookings().stream().map(Utils::mapBookingEntityToBookingDto).collect(Collectors.toList()));
        return roomDto;
    }

   

    public static BookingDto mapBookingEntityToBookingDtoWithBookedRooms(Booking booking, boolean mapUser) {
        BookingDto bookingDto = new BookingDto();
        bookingDto.setCheckInDate(booking.getCheckInDate());
        bookingDto.setCheckOutDate(booking.getCheckOutDate());
        bookingDto.setId(booking.getId());
        bookingDto.setNumOfAdults(booking.getNumOfAdults());
        bookingDto.setNumOfChildren(booking.getNumOfChildren());
        bookingDto.setNumOfGuests(booking.getNumOfGuests());
        bookingDto.setBookingConfigurationCode(booking.getBookingConfirmationCode());
        if(mapUser ){
            bookingDto.setUser(mapUserEntityToUserDto(booking.getUser()));
        }
        if (booking.getRoom()!= null) {
            bookingDto.setRoom(mapRoomEntityToRoomDto(booking.getRoom()));
            
        }
        return bookingDto;
    }
    
    public static List<UserDto> mapUserListToUserDTOList(List<User> userList){
        return userList.stream().map(Utils::mapUserEntityToUserDto).collect(Collectors.toList());
    }
    public static List<RoomDto> mapRoomListToRoomDtoList(List<Room> roomList){
        return roomList.stream().map(Utils::mapRoomEntityToRoomDto).collect(Collectors.toList());
    }
    public static List<BookingDto> mapBookingListToBookingDtoList(List<Booking> bookingList){
        return bookingList.stream().map(Utils::mapBookingEntityToBookingDto).collect(Collectors.toList());
    }
}
