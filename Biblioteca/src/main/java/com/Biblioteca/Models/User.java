package com.Biblioteca.Models;


import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "table_users")
public class User {

    @Id //primary key
    @GeneratedValue (strategy = GenerationType.IDENTITY) //valor autogenerado por la database
    private Long id;
    private String name;
    @Column(unique = true)
    private String email;
    private String password;
    private String role;
     @OneToMany (mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
     private List<Book> books = new ArrayList<>();


    public User() {
    }

    //Constructor login
    public User (Long id, String email, String password){
        this.id = id;
        this.email = email;
        this.password = password;
    }
    public User(Long id, String name, String email, String password, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<Book> getBooks() {
        return books;
    }
    public void setBooks(List<Book> books) {
        this.books = books;
    }
}//cierra la clase User
