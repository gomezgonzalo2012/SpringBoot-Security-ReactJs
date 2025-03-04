package com.thecentral.TheCentralHotel.service.impl;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.thecentral.TheCentralHotel.exception.OurException;
import com.thecentral.TheCentralHotel.service.interfaces.ICloudinaryService;





@Service
public class CloudinaryService implements ICloudinaryService{

    @Autowired
    private Cloudinary cloudinary; // importado gracias al bean creado 

    @SuppressWarnings("unchecked") // quita una advertencia
    @Override
    public String fileUpload(MultipartFile file) {
        List<String> allowedExtensions = Arrays.asList("jpg","jpeg","png","webp","avif");
        String extensions = null;
        if(file.getOriginalFilename()!=null){
            String[] splitName = file.getOriginalFilename().split("\\."); // escapado necesario "\\."
            extensions = splitName[splitName.length -1]; // tenemos la extension del archivo
        }
        if(!allowedExtensions.contains(extensions)) throw new OurException( // verificamos tenga extension permitida
            String.format("Extension not allowed", extensions)
        );

        try {
            Map<String, Object> resultUpload = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", "centralHotel")); // lo gaurda en la carpeta centralHotel creada en cloudinary 
            String imageUrl = resultUpload.get("secure_url").toString();
            return imageUrl;

        } catch (Exception e) {
            throw new OurException("Unable to upload the file, "+e.getMessage());
        }
    }
    

}
