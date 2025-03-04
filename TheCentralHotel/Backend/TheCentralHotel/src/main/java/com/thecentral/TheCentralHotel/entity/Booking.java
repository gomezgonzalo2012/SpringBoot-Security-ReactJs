package com.thecentral.TheCentralHotel.entity;

import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import lombok.Data;

@Data
@Entity
@Table(name="bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @NotNull(message= "check in Date is required")
    private LocalDate checkInDate;
    @Future(message = "check out date must be in the future") // verifica que sea tiempo futuro
    private LocalDate checkOutDate;

    @Min(value=1, message = "Number of adults should be at least 1.")
    private int numOfAdults;
    @Min(value=0, message = "Number of childrem should not be lees than 0.")
    private int numOfChildren;

    private int numOfGuests;
    private String bookingConfirmationCode;

    @ManyToOne(fetch = FetchType.EAGER) //  se carga usuario y booking  cada vez que se consulta
    @JoinColumn(name="user_id")
    private User user;
    @ManyToOne(fetch = FetchType.LAZY) // solo se carga booking , se cargara room solo cuando se especifica
    @JoinColumn(name="room_id")
    private Room room;

    public void calculateNumberOfGuests(){
        this.numOfGuests= this.numOfAdults + this.numOfChildren;
    }
    
    public void setNumOfAdults(int numOfAdults){
        this.numOfAdults = numOfAdults;
        calculateNumberOfGuests(); // calcula automaticamente
    }
    public void setNumOfChildren(int numOfChildren){
        this.numOfChildren = numOfChildren;
        calculateNumberOfGuests(); // calcula automaticamente 
    }

    @Override
    public String toString() {
        return "Booking [id=" + id + ", checkInDate=" + checkInDate + ", checkOutDate=" + checkOutDate
                + ", numOfAdults=" + numOfAdults + ", numOfChildren=" + numOfChildren + ", numOfGuests=" + numOfGuests
                + ", bookingConfirmationCode=" + bookingConfirmationCode + "]";
    }

    

}
