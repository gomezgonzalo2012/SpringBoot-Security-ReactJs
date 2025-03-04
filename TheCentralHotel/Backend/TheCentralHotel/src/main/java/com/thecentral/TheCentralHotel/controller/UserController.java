package com.thecentral.TheCentralHotel.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thecentral.TheCentralHotel.dto.ResponseDto;
import com.thecentral.TheCentralHotel.service.interfaces.IUserService;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/users")
@Tag(name="users")
public class UserController {

    @Autowired
    private IUserService userService;
    @GetMapping("all")
    @PreAuthorize("hasAuthority('ADMIN')")// ejecuta previo al entrar al metodo
    public ResponseEntity<?> getAllUsers() {
        ResponseDto response = userService.getAllUsers();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    
    @GetMapping("get-by-id/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        ResponseDto response = userService.getUserById(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @DeleteMapping("delete/{userId}")
    //@PreAuthorize("hasAuthority('ADMIN')")// ejecuta previo al entrar al metodo
    public ResponseEntity<?> deleeteUser(@PathVariable String userId) {
        ResponseDto response = userService.deleteUser(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @GetMapping("get-logged-in-profile-info")
    public ResponseEntity<?> getLoggedInUserProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // nos permite traer el email por que asi lo sobreescribimos en la clase User metodo GetUsername()
        String email = auth.getName(); 
        ResponseDto response = userService.getUserInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @GetMapping("get-user-bookings/{userId}")
    public ResponseEntity<?> getUserBookingHistory(@PathVariable String userId) {
        ResponseDto response = userService.getUserBookingHistory(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
