import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AnnotationService } from '../../services/annotation.service';



@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  books: any[] = [];
  UserId: number = 0; // inicialización
  AddBookForm: boolean = false; // Inicializa la variable AddBookForm como falsa para que no se visualize
  newBook: any = { tittle: '', author: '', year: null, genre: '' };
  selectedBookId: number | null = null; //id del libro seleccionado inicializado en nulo
  showAnnotationForm: boolean = false; // Controla la visibilidad del formulario de anotaciones
  newAnnotation: string = ''; // Nueva anotación
  selectedAnnotation: string | null = null; // Anotación seleccionada
  editingBookId: number | null = null; // ID del libro que se está editando


  // inyección de dependencias en el constructor
  constructor(
    private bookService: BookService,
    private AuthService: AuthService,
    private router: Router,
    private annotationService: AnnotationService
  ) { }

  ngOnInit(): void {
    this.UserId = this.AuthService.getUserId(); // Obtiene el ID del usuario desde el servicio de autenticación
    this.getBooks();
  }
  // Obtener la lista de libros del usuario
  getBooks(): void {
    this.bookService.getBooks(this.UserId).subscribe({
      next: (data) => {
        console.log('Books:', data); // Verifica los libros obtenidos
        this.books = data.map(book => ({
          ...book,
          annotations: book.annotations || []
        }));
      },
      error: (err) => {
        console.error('Error en el fecth', err);
      }
    });
  }

  // Añadir un nuevo libro
  addBook(): void {
    const bookToAdd = { ...this.newBook, userId: this.UserId };
    this.bookService.addBook(bookToAdd).subscribe({
      next: (data) => {
        this.books.push(data); // Añade el libro a la lista
        this.newBook = { tittle: '', author: '', year: null, genre: '' }; // Resetea el formulario
        this.AddBookForm = false; // Oculta el formulario
      },
      error: (err) => {
        console.error('Error en el add', err);
      }
    });
  }


  // Alterna la visibilidad
  toggleAnnotations(bookId: number): void {
    this.selectedBookId = this.selectedBookId === bookId ? null : bookId;
  
    if (this.selectedBookId) {
      this.annotationService.getAnnotationsByBook(bookId).subscribe({
        next: (annotations) => {
          const book = this.books.find(b => b.bookId === bookId);
          if (book) {
            book.annotations = annotations; // Actualiza las anotaciones del libro
          }
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });
    }
  }

  // Muestra el formulario para añadir una anotación
  openAnnotationForm(bookId: number): void {
    console.log('Book ID:', bookId);//verificación del id del libro
    this.selectedBookId = bookId;
    this.showAnnotationForm = true;
  }
  // Cierra el formulario de anotaciones
  closeAnnotationForm(): void {
    this.showAnnotationForm = false;
    this.newAnnotation = '';
  }
  // Añade una anotación al libro seleccionado
  addAnnotation(): void {

    console.log('aqui llega:', this.newAnnotation);
    if (this.selectedBookId) {
      //verificación de la annotation
      console.log('anotacion:', this.newAnnotation);
      //verificación del id del libro
      console.log('Book ID:', this.selectedBookId);
      this.annotationService.addAnnotationToBook(this.selectedBookId, this.newAnnotation).subscribe({
        next: (data) => {
          const book = this.books.find((b) => b.id === this.selectedBookId);
          if (book) {
            book.annotations.push(data.text); // Añade la nueva anotación a la lista
          }
          this.closeAnnotationForm();
        },
        error: (err) => {
          console.error('Error en el add', err);
        }
      });
    } else {
      console.error('no hay ibro seleccionado');
    }
  }
  // Almacena el contenido de la anotación
  selectAnnotation(annotation: any): void {
    this.selectedAnnotation = annotation.text;
  }
  // Limpia la anotación seleccionada
  closeSelectedAnnotation(): void {
    this.selectedAnnotation = null; 
  }
  logout(): void {
    // Elimina los datos del usuario del almacenamiento local
    localStorage.removeItem('user'); 
    // Redirige al usuario a la página de inicio de sesión
    this.router.navigate(['/login']); 
  }
  deleteBook(bookId: number): void {
    this.bookService.deleteBook(bookId).subscribe({
      next: () => {
        this.books = this.books.filter(book => book.id !== bookId); // Elimina el libro de la lista local
        console.log(`Book with ID ${bookId} deleted successfully.`);
      },
      error: (err) => {
        console.error('Error delete', err);
      }
    });
  }
  updateBook(bookId: number): void {
    const bookToUpdate = this.books.find(book => book.bookId === bookId);
    if (!bookToUpdate) {
      console.error('No se encuentra el book');
      return;
    }

    const updatedData = {
      title: bookToUpdate.title,
      author: bookToUpdate.author,
      year: bookToUpdate.year,
      genre: bookToUpdate.genre
    };

    this.bookService.updateBook(bookId, updatedData).subscribe({
      next: (response) => {
        console.log(response);
        alert('Libro actualizado correctamente');
      },
      error: (err) => {
        console.error('Error en update:', err);
      }
    });
  }
  toggleEditBook(bookId: number): void {
    this.editingBookId = this.editingBookId === bookId ? null : bookId;
  }
  
  
}
