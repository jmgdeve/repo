package com.Biblioteca.Controllers;


import com.Biblioteca.Models.Book;
import com.Biblioteca.Models.User;
import com.Biblioteca.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.Biblioteca.Models.Security;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;




@CrossOrigin(origins = "http://localhost:4200") // para permitir el acceso desde el front
@RestController
@RequestMapping("/users")
public class UserController {
    //declara la dependencia de UserRepository
    private final UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @GetMapping("/allusers")
    public List<User> getUsers() {

        return userRepository.findAll();

    }

    @GetMapping("/users/{name}")
    public List<User> getUsersByName(@PathVariable("name") String name) {
        return userRepository.findByName(name);
    }


    // Metodo para registrar usuarios
    // Si el email ya esta registrado, se devuelve un status 409 (conflict), si no, devuelve 201 (Created)

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> saveUser(@RequestBody User user) {
        //mapa para almacenar la respuesta y enviarla en formato JSON
        Map<String, String> response = new HashMap<>();
        //comprueba si existe el email
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            response.put("message", "Email already registered");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } else {

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(user);
            response.put("message", "User registered successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
    }
    //login de usuarios

    @PostMapping ("/login")
    public ResponseEntity<Map<String ,Object>> loginUser(@RequestBody User user) {
       Map<String, Object> response = new HashMap<>();
       //comprueba si existe el email
        Optional <User> userOptional = userRepository.findByEmail(user.getEmail());


         if (userOptional.isPresent()) {
              User userToLogin = userOptional.get();

              //login correcto
              if (passwordEncoder.matches(user.getPassword(), userToLogin.getPassword())) {
                  String token = Security.generateToken(userToLogin.getEmail());
                  response.put("message", "Login successful");
                  response.put("token", token);
                //devulve JSON con los datos del user en objeto
                  response.put ("user", userToLogin);
                  return ResponseEntity.status(HttpStatus.OK).body(response);
                //Fallo al login
              } else {
                  response.put("message", "Incorrect password");
                  return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
              }
         } else {
              response.put("message", "User not found");
              return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
         }


    }

    @PutMapping("/users")
    public User updateUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PutMapping("/users/{id}")
    public UserController updateUser(@PathVariable("id") Long id, @RequestBody User user) {
        User userToUpdate = userRepository.findById(id).get();
        userToUpdate.setName(user.getName());
        userToUpdate.setEmail(user.getEmail());
        userToUpdate.setPassword(user.getPassword());
        userToUpdate.setRole(user.getRole());
        userRepository.save(userToUpdate);
        return this;
    }

    @DeleteMapping("/users/{id}")
    public UserController deleteUser(@PathVariable("id") Long id) {
        userRepository.deleteById(id);
        return this;
    }

    @PostMapping("/{userId}/books")
    public ResponseEntity<?> addBookToUser(@PathVariable Long userId, @RequestBody Book book) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            book.setUser(user); // Asocia el libro al usuario
            user.getBooks().add(book); // Agrega el libro a la lista del usuario
            userRepository.save(user); // Guarda los cambios
            return ResponseEntity.status(HttpStatus.CREATED).body("Book added successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @DeleteMapping("/{userId}/books/{bookId}")
    public ResponseEntity<?> deleteBookFromUser(@PathVariable Long userId, @PathVariable Long bookId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.getBooks().removeIf(book -> book.getBookId().equals(bookId)); // Elimina el libro por ID
            userRepository.save(user); // Guarda los cambios
            return ResponseEntity.ok("Book deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
}
