package com.thecentral.TheCentralHotel.service.interfaces;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.thecentral.TheCentralHotel.dto.ResponseDto;

public interface IRoomService {

    ResponseDto addNewRoom(MultipartFile image, String roomType, BigDecimal roomPrice, String roomDescrption);
    List<String> getAllRoomTypes();
    ResponseDto getAllRooms();
    ResponseDto deleteRoom(Long roomId);
    ResponseDto updateRoom(MultipartFile image, String roomType, BigDecimal roomPrice, String roomDescrption, Long roomId);
    ResponseDto getRoomById(Long roomId);
    ResponseDto getAvailableRoomsByDatesAndTypes(LocalDate checkInDate, LocalDate checkOuDate, String roomType);
    ResponseDto getAllAvailableRooms();

}
