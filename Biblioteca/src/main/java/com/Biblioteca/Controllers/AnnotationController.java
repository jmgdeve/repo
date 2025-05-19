package com.Biblioteca.Controllers;

import com.Biblioteca.Repository.AnnotationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.Biblioteca.Models.Annotation;
import com.Biblioteca.Models.Book;

import java.util.List;
import java.util.Map;

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
    @DeleteMapping("/delete/{annotationId}")
    public ResponseEntity <Map<String, String>> deleteAnnotation(@PathVariable Long annotationId) {
        if (annotationRepository.existsById(annotationId)) {
            annotationRepository.deleteById(annotationId);
            return ResponseEntity.ok(Map.of("message","Annotation deleted successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message","Annotation not found"));
        }
    }

}

