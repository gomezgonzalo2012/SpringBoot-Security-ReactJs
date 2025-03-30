package com.thecentral.TheCentralHotel.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thecentral.TheCentralHotel.dto.ResponseDto;
import com.thecentral.TheCentralHotel.service.interfaces.IBookingService;
import com.thecentral.TheCentralHotel.service.interfaces.IRoomService;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/rooms")
@Tag(name="rooms")
public class RoomController {
    @Autowired
    IRoomService roomService;
    @Autowired
    IBookingService bookingService;

    @PostMapping(value="add", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ResponseDto> addNewRoom(
        @RequestPart(value="photo", required = false) MultipartFile photo,
        @RequestParam(value="roomType", required = false) String roomType,
        @RequestParam(value="roomPrice", required = false) BigDecimal roomPrice,
        @RequestParam(value="roomDescription", required = false) String roomDescription ) {
        ResponseDto response = new ResponseDto();

        if(photo==null || photo.isEmpty()|| roomPrice==null || roomType==null || roomType.isBlank()){
            response.setStatusCode(400);
            response.setMessage("Please prive values for all fields (photo, room type, room price)");
        }else response = roomService.addNewRoom(photo, roomType, roomPrice, roomDescription);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @GetMapping("all")
    public ResponseEntity<?> getAllRooms() {
        ResponseDto response = roomService.getAllRooms();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @GetMapping("types")
    public ResponseEntity<?> getRoomTypes() {
        List<String> roomTypes = roomService.getAllRoomTypes();
        return ResponseEntity.status(200).body(roomTypes);
    }
    
    @GetMapping("get-room-id/{roomId}")
    public ResponseEntity<?> getRoomById(@PathVariable String roomId) {
        ResponseDto response = roomService.getRoomById(Long.valueOf(roomId));
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @GetMapping("all-available-rooms")
    public ResponseEntity<?> getAvailableRooms() {
        ResponseDto response = roomService.getAllAvailableRooms();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @GetMapping("available-rooms-by-date-and-type")
    public ResponseEntity<?> getAvailableRoomsByDatesAndTypes(
        @RequestParam( required=false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE ) LocalDate checkInDate,
        @RequestParam( required=false)@DateTimeFormat(iso = DateTimeFormat.ISO.DATE ) LocalDate checkOutDate, 
        @RequestParam( required=false) String roomType) {
        ResponseDto response = new ResponseDto();
        if(checkInDate==null || checkOutDate==null || roomType==null || roomType.isBlank()){
                response.setStatusCode(400);
                response.setMessage("Please prive values for all fields (checkInDate, checkOutDate, room type)");
        }
        response = roomService.getAvailableRoomsByDatesAndTypes(checkInDate, checkOutDate, roomType);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @PutMapping(value="update/{roomId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> putMethodName(
        @RequestPart(value="photo", required = false) MultipartFile photo,
        @RequestParam(value="roomType", required = false) String roomType,
        @RequestParam(value="roomPrice", required = false) BigDecimal roomPrice,
        @RequestParam(value="roomDescription", required = false) String roomDescription,
        @PathVariable String roomId ) {
        
        ResponseDto response =  roomService.updateRoom(photo, roomType, roomPrice, roomDescription, Long.valueOf(roomId));
        
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("delete/{roomId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteRoom(@PathVariable String roomId){
        ResponseDto response = roomService.deleteRoom(Long.valueOf(roomId));
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
