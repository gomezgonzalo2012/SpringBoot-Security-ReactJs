package com.thecentral.TheCentralHotel.dto;


import java.util.List;

import org.springframework.data.domain.Page;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseDto { // usado para todas las Responses posibles
    private int statusCode;
    private String message;
    private String token;
    private String role;
    private String expirationTime;
    private String bookingConfirmationCode;
    private UserDto user;
    private BookingDto booking;
    private RoomDto room;
    private List<RoomDto> roomList ;
    private Page<RoomDto> roomPage ;
    private List<BookingDto> bookingList ;
    private List<UserDto> userList ;
}
