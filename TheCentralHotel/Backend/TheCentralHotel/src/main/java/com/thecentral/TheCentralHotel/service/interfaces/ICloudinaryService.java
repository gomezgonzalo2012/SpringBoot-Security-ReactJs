package com.thecentral.TheCentralHotel.service.interfaces;

import org.springframework.web.multipart.MultipartFile;

public interface ICloudinaryService {
    String fileUpload(MultipartFile file);
}
