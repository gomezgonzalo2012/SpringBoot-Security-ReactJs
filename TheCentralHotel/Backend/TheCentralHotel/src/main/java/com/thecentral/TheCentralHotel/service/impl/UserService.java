package com.thecentral.TheCentralHotel.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.thecentral.TheCentralHotel.dto.LoginRequestDto;
import com.thecentral.TheCentralHotel.dto.ResponseDto;
import com.thecentral.TheCentralHotel.dto.UserDto;
import com.thecentral.TheCentralHotel.entity.User;
import com.thecentral.TheCentralHotel.exception.OurException;
import com.thecentral.TheCentralHotel.repository.UserRepository;
import com.thecentral.TheCentralHotel.service.interfaces.IUserService;
import com.thecentral.TheCentralHotel.utils.JWTUtils;
import com.thecentral.TheCentralHotel.utils.Utils;

@Service
public class UserService implements IUserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JWTUtils jwtUtils; 
    @Autowired 
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public ResponseDto register(User user) {
        ResponseDto response = new ResponseDto();
        try {
            if(user.getRole()==null || user.getRole().isBlank()){
                user.setRole("USER");
            }
            if(userRepository.existsByEmail(user.getEmail())){
                throw new OurException(user.getEmail()+" already exists");
            }
            user.setPassword(passwordEncoder.encode(user.getPassword())); // codificamos la contraseña 
            //User savedUser = userRepository.save(user);
            UserDto userDto = Utils.mapUserEntityToUserDto(userRepository.save(user)); // guardamos en la bbdd
            response.setStatusCode(200);
            response.setUser(userDto);

        } catch (OurException ex) {
            response.setStatusCode(400);
            response.setMessage(ex.getMessage());
        }catch(Exception ex){
            response.setStatusCode(500);
            response.setMessage("Error ocurred during user registration "+ex.getMessage());
        }
        return response;

    }

    @Override
    public ResponseDto login(LoginRequestDto loginRequest) {
        ResponseDto response = new ResponseDto();

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(()-> new OurException("User not found"));
            String token = jwtUtils.generateToken(user);
            response.setStatusCode(200);
            response.setToken(token);
            response.setRole(user.getRole());
            response.setExpirationTime("7 days");
            response.setMessage("successful");

        } catch(OurException ex){
            response.setStatusCode(404);
            response.setMessage(ex.getMessage());

        } catch (BadCredentialsException ex) {
            response.setStatusCode(500);
            response.setMessage("Incorrect password or email ");
        }
        catch (Exception ex) {
            response.setStatusCode(500);
            response.setMessage("Error ocurred during user login "+ex.getMessage());
        }
        return response;
    }

    @Override
    public ResponseDto getAllUsers() {
        ResponseDto response = new ResponseDto();
        try {
            List<User> userList = userRepository.findAll();
            List<UserDto> userDtoList = Utils.mapUserListToUserDTOList(userList);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUserList(userDtoList);
        } catch (Exception ex) {
            response.setStatusCode(500);
            response.setMessage("Error getting all users "+ex.getMessage());
        }
        return response;
    }

    @Override
    public ResponseDto getUserBookingHistory(String userId) {
        ResponseDto response = new ResponseDto();
        try {
            User user = userRepository.findById(Long.valueOf(userId)).orElseThrow(()-> new OurException("User Not Found"));
            UserDto userDto = Utils.mapUserEntityToUserDtoWithBookingAndRoom(user);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUser(userDto); 
        }  catch(OurException ex){
            response.setStatusCode(404);
            response.setMessage(ex.getMessage());

        } catch (Exception ex) {
            response.setStatusCode(500);
            response.setMessage("Error getting user's bookings "+ex.getMessage());
        }
        return response;
    }

    @Override
    public ResponseDto deleteUser(String userId) {
        ResponseDto response = new ResponseDto();
        try {
            userRepository.findById(Long.valueOf(userId)).orElseThrow(()-> new OurException("User Not Found"));
            userRepository.deleteById(Long.valueOf(userId));
            response.setStatusCode(200);
            response.setMessage("successful");
        }  catch(OurException ex){
            response.setStatusCode(404);
            response.setMessage(ex.getMessage());

        } catch (Exception ex) {
            response.setStatusCode(500);
            response.setMessage("Error deleting the user "+ex.getMessage());
        }
        return response;
    }

    @Override
    public ResponseDto getUserById(String userId) {
        ResponseDto response = new ResponseDto();
        try {
            User user = userRepository.findById(Long.valueOf(userId)).orElseThrow(()-> new OurException("User Not Found"));
            UserDto userDto = Utils.mapUserEntityToUserDto(user);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUser(userDto); 
        }  catch(OurException ex){
            response.setStatusCode(404);
            response.setMessage(ex.getMessage());

        } catch (Exception ex) {
            response.setStatusCode(500);
            response.setMessage("Error getting the user "+ex.getMessage());
        }
        return response;
    }

    @Override
    public ResponseDto getUserInfo(String email) {
        ResponseDto response = new ResponseDto();
        try {
            User user = userRepository.findByEmail(email).orElseThrow(()-> new OurException("User Not Found"));
            UserDto userDto = Utils.mapUserEntityToUserDto(user);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUser(userDto); 
            
        }  catch(OurException ex){
            response.setStatusCode(404);
            response.setMessage(ex.getMessage());

        } catch (Exception ex) {
            response.setStatusCode(500);
            response.setMessage("Error getting the user "+ex.getMessage());
        }
        return response;
    }

}
