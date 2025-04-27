package com.Biblioteca.Repository;
 import com.Biblioteca.Models.Annotation;
 import org.springframework.stereotype.Repository;
 import org.springframework.data.jpa.repository.JpaRepository;
 import java.util.List;

 @Repository
public interface AnnotationRepository extends JpaRepository<Annotation, Long> {


    List<Annotation> findByBook_BookId(long bookId);

}
