package com.Biblioteca.Repository;
import com.Biblioteca.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByName(@Param("name") String name);
    //busca si hay un usuario con el email dado y devuelve un true o false dependieno de si existe el valor o es null
    Optional<User> findByEmail(String email);

}
