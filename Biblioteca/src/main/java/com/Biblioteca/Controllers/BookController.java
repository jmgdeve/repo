package com.Biblioteca.Controllers;


import com.Biblioteca.Models.Book;
import com.Biblioteca.Repository.BookRepository;
import com.Biblioteca.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.Biblioteca.Models.User;


import java.util.Map;


import java.util.List;

@CrossOrigin(origins = "http://localhost:4200", methods = {RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.GET, RequestMethod.POST}) // para permitir el acceso desde el front
@RestController
@RequestMapping("/books")
public class BookController {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private List<Book> all;

    public BookController(BookRepository bookRepository, UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/books")
    public List<Book> getBooks() {
        return all;
    }

    @GetMapping("/user/{UserId}")
    public List<Book> getBooksByUserId(@PathVariable("UserId") long UserId) {
        return bookRepository.findByUser_Id(UserId);
    }

    @GetMapping("/tittle/{title}")
    public List<Book> getBooksByTitle(@PathVariable("title") String title) {
        return bookRepository.findByTitle(title);
    }

    @PostMapping("/register")
    public Book saveBook(@RequestBody Map<String, Object> bookData) {
        String title = (String) bookData.get("tittle");
        String author = (String) bookData.get("author");
        String genre = (String) bookData.get("genre");
        int year = (int) bookData.get("year");
        Long userId = ((Number) bookData.get("userId")).longValue();


        // Buscar al usuario por su ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Crear un nuevo objeto Book y asigna los valores
        Book book = new Book();
        book.setTitle(title);
        book.setAuthor(author);
        book.setGenre(genre);
        book.setYear(year);
        book.setUser(user);

        // Guardar el libro en la base de datos
        return bookRepository.save(book);
    }

    @DeleteMapping("/delete/{bookId}")
    public ResponseEntity<String> deleteBook(@PathVariable Long bookId) {
        if (bookRepository.existsById(bookId)) {
            bookRepository.deleteById(bookId);
            return ResponseEntity.ok("Book deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
        }
    }
    @PutMapping("/update/{bookId}")
    public ResponseEntity<Map<String,String>> updateBook(@PathVariable Long bookId, @RequestBody Map<String, Object> bookData) {
        // Verificar si el libro existe
        if (bookRepository.existsById(bookId)) {
            // Obtener el libro existente
            Book bookToUpdate = bookRepository.findById(bookId).orElseThrow(() -> new RuntimeException("Book not found"));

            // Actualizar los campos si están presentes en el JSON
            if (bookData.containsKey("title")) {
                bookToUpdate.setTitle((String) bookData.get("title"));
            }
            if (bookData.containsKey("author")) {
                bookToUpdate.setAuthor((String) bookData.get("author"));
            }
            if (bookData.containsKey("year")) {
                bookToUpdate.setYear((int) bookData.get("year"));
            }
            if (bookData.containsKey("genre")) {
                bookToUpdate.setGenre((String) bookData.get("genre"));
            }

            // Guardar los cambios en la base de datos
            bookRepository.save(bookToUpdate);
            return ResponseEntity.ok(Map.of("message","Book updated successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error","Book not found"));
        }
    }

}//cierra la clase
