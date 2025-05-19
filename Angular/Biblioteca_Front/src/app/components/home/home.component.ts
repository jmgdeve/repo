import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnnotationService } from '../../services/annotation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BooksComponent } from '../books/books.component';
import { AnnotationsComponent } from '../annotations/annotations.component';





@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, BooksComponent, AnnotationsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
 
selectedBookId: number | null = null;
selectedAnnotation: any = null;
@ViewChild('booksComp') booksComponent!: BooksComponent;

  // inyección de dependencias en el constructor
  constructor(

    private router: Router,
    private annotationService: AnnotationService
  ) { }

  ngOnInit(): void {

  }
  onAnnotationAdded() {
    if (this.booksComponent) {
      this.booksComponent.getBooks(); // Refresca los libros y sus anotaciones
    }
  }
  onAnnotationSelected(event: { annotation: any, bookId: number }) {
  this.selectedAnnotation = event.annotation;
  this.selectedBookId = event.bookId;
}
onBookSelected(bookId: number) {
  this.selectedBookId = bookId;
  this.selectedAnnotation = null;
}
  logout(): void {
    // Elimina los datos del usuario del almacenamiento local
    localStorage.removeItem('user');
    // Redirige al usuario a la página de inicio de sesión
    this.router.navigate(['/login']);
  }


}
