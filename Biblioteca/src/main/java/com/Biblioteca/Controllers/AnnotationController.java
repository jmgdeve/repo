package com.Biblioteca.Controllers;

import com.Biblioteca.Repository.AnnotationRepository;
import org.springframework.web.bind.annotation.*;
import com.Biblioteca.Models.Annotation;
import com.Biblioteca.Models.Book;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200") // para permitir el acceso desde el front
@RestController
@RequestMapping("/annotations")

public class AnnotationController {
    private final AnnotationRepository annotationRepository;

    public AnnotationController(AnnotationRepository annotationRepository) {
        this.annotationRepository = annotationRepository;
    }
    // Metodo para obtener todas las anotaciones de un libro
    @GetMapping ("/annotation/{bookId}")
    public List<Annotation> findByBookId(@PathVariable("bookId") long bookId) {
        return annotationRepository.findByBook_BookId(bookId);
    }

    // Metodo para añadir anotaciones a un libro

    @PostMapping ("/add/{bookId}")
    public Annotation updateAnnotation (@PathVariable ("bookId") long bookId, @RequestBody Annotation annotation) {
        Book book = new Book();
        book.setBookId (bookId);
        annotation.setBook(book);
        return annotationRepository.save(annotation);
    }

}
