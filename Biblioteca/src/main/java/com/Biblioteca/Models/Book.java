package com.Biblioteca.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.Date;


@Entity
@Table(name = "table_books")
public class Book {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)

    private Long bookId;
    private String title;
    private String author;
    private String genre;
    private int year;
    private String status;
    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    @JsonIgnore //Evitar serialización de la relación con User
    private User user;

    public Book() {
    }

    public Book(Long bookId, String title, String author, String genre, int year, String status) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.year = year;
        this.status = status;

    }
    //guardar el usuario al que pertenece el libro
    public Book (Long bookId, String title, String author, String genre, int year, String status, User user) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.year = year;
        this.status = status;
        this.user = user;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(long bookId) {
        this.bookId = bookId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }



}//cierra la clase
