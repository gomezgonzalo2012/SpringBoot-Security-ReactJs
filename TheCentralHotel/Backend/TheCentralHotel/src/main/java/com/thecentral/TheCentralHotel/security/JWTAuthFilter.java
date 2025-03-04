package com.thecentral.TheCentralHotel.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.thecentral.TheCentralHotel.service.CustomUserDetailsService;
import com.thecentral.TheCentralHotel.utils.JWTUtils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JWTAuthFilter extends OncePerRequestFilter{ // una sola ejecucion por request recibida
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    //private CachingUserDetailsService cachingUserDetailsService;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");

        final String jwtToken;
        final String userEmail;

        if(authHeader == null || authHeader.isBlank()){ // validamos que el header Auth exista
            filterChain.doFilter(request, response);
            return ;
        }

        jwtToken = authHeader.substring(7); // ignoramos "Bearer "
        userEmail = jwtUtils.extractUsername(jwtToken); // extraemos el subject (email) del token

        if(userEmail != null && SecurityContextHolder.getContext().getAuthentication()== null){ //??
            UserDetails userdetails = customUserDetailsService.loadUserByUsername(userEmail); // traemos al usuario
            if(jwtUtils.isValidToken(jwtToken, userdetails)){ // validamos el token 
                // guardamos el usuario autenticado en el contexto
                SecurityContext securityContext = SecurityContextHolder.createEmptyContext(); 
                UsernamePasswordAuthenticationToken token = 
                new UsernamePasswordAuthenticationToken(userdetails, null, userdetails.getAuthorities());
                securityContext.setAuthentication(token);
                SecurityContextHolder.setContext(securityContext);
            }
        }
        filterChain.doFilter(request, response);
    }


}
