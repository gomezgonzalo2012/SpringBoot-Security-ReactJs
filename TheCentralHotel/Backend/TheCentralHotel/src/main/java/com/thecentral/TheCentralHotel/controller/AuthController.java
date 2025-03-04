package com.thecentral.TheCentralHotel.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thecentral.TheCentralHotel.dto.LoginRequestDto;
import com.thecentral.TheCentralHotel.dto.ResponseDto;
import com.thecentral.TheCentralHotel.entity.User;
import com.thecentral.TheCentralHotel.service.interfaces.IUserService;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/auth")
@Tag(name="auth")
public class AuthController {
    @Autowired
    private IUserService userService;

    @PostMapping("register")
    public ResponseEntity<ResponseDto> register(@RequestBody User user) {
        ResponseDto response = userService.register(user);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @PostMapping("login")
    public ResponseEntity<ResponseDto> login(@RequestBody LoginRequestDto loginRequest) {
        ResponseDto response = userService.login(loginRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
}
