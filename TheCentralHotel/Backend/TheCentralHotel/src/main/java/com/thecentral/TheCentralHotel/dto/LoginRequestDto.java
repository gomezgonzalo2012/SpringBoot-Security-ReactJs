package com.thecentral.TheCentralHotel.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDto {
    @NotBlank(message="email is required")
    private String email;
    @NotBlank(message="password is required")
    private String password;
}
