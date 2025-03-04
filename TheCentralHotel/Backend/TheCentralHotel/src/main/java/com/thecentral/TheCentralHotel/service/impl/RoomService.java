package com.thecentral.TheCentralHotel.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thecentral.TheCentralHotel.dto.ResponseDto;
import com.thecentral.TheCentralHotel.dto.RoomDto;
import com.thecentral.TheCentralHotel.entity.Room;
import com.thecentral.TheCentralHotel.exception.OurException;
import com.thecentral.TheCentralHotel.repository.RoomRepository;
import com.thecentral.TheCentralHotel.service.interfaces.ICloudinaryService;
import com.thecentral.TheCentralHotel.service.interfaces.IRoomService;
import com.thecentral.TheCentralHotel.utils.Utils;

@Service
public class RoomService implements IRoomService{
    @Autowired
    RoomRepository roomRepository;
    @Autowired
    ICloudinaryService cloudinaryService;


    @Override
    public ResponseDto addNewRoom(MultipartFile photo, String roomType, BigDecimal roomPrice, String roomDescrption) {
        ResponseDto response = new ResponseDto();
        try {
            String photoUrl = cloudinaryService.fileUpload(photo);
            Room room = new Room();
            room.setRoomDescription(roomDescrption);
            room.setRoomPrice(roomPrice);
            room.setRoomType(roomType);
            // guardamos la photon
            room.setRoomPhotoUrl(photoUrl);

            Room savedRoom = roomRepository.save(room);
            RoomDto roomDto = Utils.mapRoomEntityToRoomDto(savedRoom);

            response.setRoom(roomDto);
            response.setStatusCode(200);
            response.setMessage("successful");

        } 
        catch (Exception ex) {
            response.setStatusCode(500);
            response.setMessage("Error saving the room "+ ex.getMessage());
        }
        return response; 
    }

    @Override
    public List<String> getAllRoomTypes() {
        return  roomRepository.findDistincRoomTypes(); 
    }

    @Override
    public ResponseDto getAllRooms() {
        ResponseDto response = new ResponseDto();
        try {
            // se ordena de menor a mayor segun id (es IDENTITY entoces ordena del mar reciente al mas viejo)
            List<Room> roomlist = roomRepository.findAll(Sort.by(Sort.Direction.DESC, "id")); 
            List<RoomDto> roomDtolist = Utils.mapRoomListToRoomDtoList(roomlist);

            response.setRoomList(roomDtolist);
            response.setStatusCode(200);
            response.setMessage("successful");
        } 
        catch (Exception ex) {
            response.setStatusCode(500);
            response.setMessage("Error retriving rooms "+ ex.getMessage());
        }
        return response; 
    }

    @Override
    public ResponseDto deleteRoom(Long roomId) {
        ResponseDto response = new ResponseDto();
        try {
            roomRepository.findById(roomId).orElseThrow(()-> new OurException("Room Not Found"));
            roomRepository.deleteById(roomId);
            response.setStatusCode(200);
            response.setMessage("successful");
        } catch(OurException ex){
            response.setStatusCode(404);
            response.setMessage( ex.getMessage());
        }   
        catch (Exception ex) {
           response.setStatusCode(500);
            response.setMessage("Error deleting the room "+ ex.getMessage());
        }
        return response;
    }

    @Override
    public ResponseDto updateRoom(MultipartFile photo, String roomType, BigDecimal roomPrice, String roomDescription,
            Long roomId) {
        ResponseDto response = new ResponseDto();
        try {
            String photoUrl  = null;
            if(photo !=null && !photo.isEmpty()){
                photoUrl = cloudinaryService.fileUpload(photo);
            }
            Room room = roomRepository.findById(roomId).orElseThrow(()-> new OurException("Room Not Found"));
            // edita solo si hay valores de lo contrario deja el valor antiguo
            if(roomType != null) room.setRoomType(roomType);
            if(roomDescription != null) room.setRoomDescription(roomDescription);
            if(roomPrice != null) room.setRoomPrice(roomPrice);
            if(photoUrl != null) room.setRoomPhotoUrl(photoUrl);

            // actualiza
            Room updatedRoom = roomRepository.save(room);
            RoomDto roomDto = Utils.mapRoomEntityToRoomDto(updatedRoom);

            response.setRoom(roomDto);
            response.setStatusCode(200);
            response.setMessage("successful");
        } catch(OurException ex){
            response.setStatusCode(404);
            response.setMessage( ex.getMessage());
        }   
        catch (Exception ex) {
           response.setStatusCode(500);
            response.setMessage("Error updating the room "+ ex.getMessage());
        }
        return response;
    }

    @Override
    public ResponseDto getRoomById(Long roomId) {
        ResponseDto response = new ResponseDto();
        try {
            Room room = roomRepository.findById(roomId).orElseThrow(()-> new OurException("Room Not Found"));
            RoomDto roomDto = Utils.mapRoomEntityToRoomDtowithBooking(room);

            response.setRoom(roomDto);
            response.setStatusCode(200);
            response.setMessage("successful");
        } catch(OurException ex){
            response.setStatusCode(404);
            response.setMessage( ex.getMessage());
        }   
        catch (Exception ex) {
           response.setStatusCode(500);
            response.setMessage("Error retriving the room "+ ex.getMessage());
        }
        return response;
    }

    @Override
    public ResponseDto getAvailableRoomsByDatesAndTypes(LocalDate checkInDate, LocalDate checkOuDate, String roomType) {
        ResponseDto response = new ResponseDto();
        try {
            List<Room> roomList = roomRepository.findAvailableRoomsByDatesAndTypes(checkInDate, checkOuDate, roomType);
            List<RoomDto> roomDtoList = Utils.mapRoomListToRoomDtoList(roomList);
            
            response.setRoomList(roomDtoList);
            response.setStatusCode(200);
            response.setMessage("successful");
        }    
        catch (Exception ex) {
           response.setStatusCode(500);
            response.setMessage("Error retriving rooms "+ ex.getMessage());
        }
        return response;
    }

    @Override
    public ResponseDto getAllAvailableRooms() {
        ResponseDto response = new ResponseDto();
        try {
            List<Room> roomList = roomRepository.getAllAvailableRooms();
            List<RoomDto> roomDtoList = Utils.mapRoomListToRoomDtoList(roomList);
            
            response.setRoomList(roomDtoList);
            response.setStatusCode(200);
            response.setMessage("successful");
        }   
        catch (Exception ex) {
           response.setStatusCode(500);
            response.setMessage("Error retriving rooms "+ ex.getMessage());
        }
        return response;
    }

}
