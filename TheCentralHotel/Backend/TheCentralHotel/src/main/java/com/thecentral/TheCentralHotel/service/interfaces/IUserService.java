package com.thecentral.TheCentralHotel.service.interfaces;

import com.thecentral.TheCentralHotel.dto.LoginRequestDto;
import com.thecentral.TheCentralHotel.dto.ResponseDto;
import com.thecentral.TheCentralHotel.entity.User;

public interface IUserService {

    ResponseDto register(User user);
    ResponseDto login(LoginRequestDto loginRequest);
    ResponseDto getAllUsers();
    ResponseDto getUserBookingHistory(String userId);
    ResponseDto deleteUser(String userId);
    ResponseDto getUserById(String userId);
    ResponseDto getUserInfo(String email);
    


}
