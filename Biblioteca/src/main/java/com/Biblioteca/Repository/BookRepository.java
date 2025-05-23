package com.Biblioteca.Repository;

import com.Biblioteca.Models.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List <Book> findByTitle(String title);
    List <Book> findByUser_Id(long userId);

}
