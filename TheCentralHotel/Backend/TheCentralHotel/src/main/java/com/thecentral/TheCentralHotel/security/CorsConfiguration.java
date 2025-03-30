package com.thecentral.TheCentralHotel.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration {

    @Bean 
    public WebMvcConfigurer webMvcConfigurer(){ // retorna un objeto que implementa la interfaz WebMvcConfigurer
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry){ // por lo de arriba debe sobreescribirse este metodo
                registry.addMapping("/**")
                    .allowedMethods("GET","POST","PUT","DELETE")
                    .allowedOrigins("*");
            }
        };
    }
}
