package com.thecentral.TheCentralHotel.utils;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Service
public class JWTUtils {
    private static final long EXPIRATION_TIME= 1000 * 60 * 24 * 7; // 7 days
    private final SecretKey Key ; 
    public JWTUtils(){
        String secretString = "uJkf8z0Rs9u1/qmVx+2QtJj4Q4phXlv9ZjYjFuFypYE="; // 32 bytes / 256 bits
        byte[] keyBytes = Base64.getDecoder().decode(secretString.getBytes(StandardCharsets.UTF_8));
        this.Key = new SecretKeySpec(keyBytes, "HmacSHA256");
    }

    public String generateToken(UserDetails userDetails){
        return Jwts.builder()
                    .subject(userDetails.getUsername())
                    .issuedAt(new Date(System.currentTimeMillis())) // hoy
                    .expiration(new Date(System.currentTimeMillis()+ EXPIRATION_TIME)) // hoy mas 7 dias
                    .signWith(Key)
                    .compact();

    }

    public String extractUsername(String token){
        return extractClaims(token, Claims :: getSubject); // referencia a metodo subject 
    }
    private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction){
        return claimsTFunction.apply(Jwts.parser().verifyWith(Key).build() // la funcion ejecutada por apply dependera del parametro Function <T,R>
                            .parseSignedClaims(token).getPayload());
    }

    public boolean isValidToken(String token, UserDetails userDetails){
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token){
        return extractClaims(token, Claims :: getExpiration).before(new Date()); // referencia a metodo get expiration
        // retorna verdadero si la expiracion del token es anterior a la nueva fecha (hoy)
    }
}
