import { Component, Input, OnInit, Output, SimpleChanges,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnnotationService } from '../../services/annotation.service';


@Component({
  selector: 'app-annotations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './annotations.component.html',
  styleUrls: ['./annotations.component.css']
})
export class AnnotationsComponent implements OnInit {
  @Input() bookId: number | null = null; // recibe ID del libro
  @Input() selectedAnnotation: any = null; // Anotación seleccionada
  annotations: any[] = []; // Almacena las anotaciones del libro
  selectedBookId: number | null = null; // ID del libro seleccionado
  showAnnotationForm: boolean = false; // Controla la visibilidad del formulario de anotaciones
  newAnnotation: string = ''; // Nueva anotación
  newAnnotationPage: string | null = null; // Página de la nueva anotación
  @Output() annotationAdded = new EventEmitter<void>();

  constructor(private annotationService: AnnotationService) { }

  ngOnInit(): void {
    console.log('Book ID:', this.bookId);
    if (this.bookId !== null) {
      this.loadAnnotations(this.bookId); // Carga las anotaciones del libro al iniciar
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookId'] && this.bookId !== null) {
      this.loadAnnotations(this.bookId);
      this.selectedAnnotation = null;
      this.showAnnotationForm = false;
    }
  }
  //  carga las anotaciones de un libro
  loadAnnotations(bookId: number): void {
    this.annotationService.getAnnotationsByBook(bookId).subscribe({
      next: (data) => {
        this.annotations = data; // Asigna las anotaciones obtenidas
        console.log('Annotations loaded:', this.annotations);
      },
      error: (err) => {
        console.error('Error loading annotations:', err);

      }
    });
  }
  // Alterna la visibilidad de las anotaciones
  toggleAnnotations(bookId: number): void {
    this.selectedBookId = this.selectedBookId === bookId ? null : bookId;

    if (this.selectedBookId) {
      this.annotationService.getAnnotationsByBook(bookId).subscribe({
        next: (annotations) => {
          console.log('Annotations:', annotations);
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });
    }
  }

  // Muestra el formulario para añadir una anotación
  openAnnotationForm(): void {
    if (this.bookId !== null) {
      this.selectedBookId = this.bookId;
      this.showAnnotationForm = true;
    }
  }

  // Cierra el formulario de anotaciones
  closeAnnotationForm(): void {
    this.showAnnotationForm = false;
    this.newAnnotation = '';
    this.newAnnotationPage = null;
  }

  // Añade una anotación al libro seleccionado
  addAnnotation(): void {
    if (this.selectedBookId && this.newAnnotationPage) {

      const annotationData = {
        text: this.newAnnotation,
        page: this.newAnnotationPage
      };
      this.annotationService.addAnnotationToBook(this.selectedBookId, annotationData).subscribe({
        next: (data) => {
          console.log('Annotation added:', data);
          this.closeAnnotationForm();
          this.loadAnnotations(this.selectedBookId!); // Recarga las anotaciones después de añadir una nueva
           this.annotationAdded.emit(); // Notifica al padre para recargar las anotaciones en las tarjetas
        },
        error: (err) => {
          console.error('Error adding annotation:', err);
        }
      });
    } else {
      console.error('No book selected');
    }
  }

  // Almacena el contenido de la anotación
  selectAnnotation(annotation: any): void {
    this.selectedAnnotation = annotation;
    this.newAnnotation = annotation.text;
  }

  // Limpia la anotación seleccionada
  closeSelectedAnnotation(): void {
    this.selectedAnnotation = null;
  }

  // Busca la anotación seleccionada por su id
  deleteSelectedAnnotation(): void {
    if (this.selectedAnnotation && this.selectedAnnotation.id) {
      const confirmDelete = window.confirm('¿Estás seguro de que quieres borrar esta anotación?');
      if (!confirmDelete) {
        return;
      }
      this.annotationService.deleteAnnotation(this.selectedAnnotation.id).subscribe({
        next: () => {
          this.annotations = this.annotations.filter(a => a.id !== this.selectedAnnotation.id);
          this.selectedAnnotation = null;
        },
        error: (err) => {
          console.error('Error deleting annotation:', err);
        }
      });
    }
  }
}