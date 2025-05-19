import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';

import { Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books: any[] = [];
  UserId: number = 0;
  AddBookForm: boolean = false;
  newBook: any = { tittle: '', author: '', year: null, genre: '' };
  editingBookId: number | null = null;
  @Output() annotationSelected = new EventEmitter<{ annotation: any, bookId: number }>();
  @Output() bookSelected = new EventEmitter<number>();

  constructor(
    private bookService: BookService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.UserId = this.authService.getUserId();
    this.getBooks();
  }

  selectAnnotation(annotation: any, bookId: number): void {
    this.annotationSelected.emit({ annotation, bookId });
  }
  getBooks(): void {
    this.bookService.getBooks(this.UserId).subscribe({
      next: (data) => {
        this.books = data.map(book => ({
          ...book,
          annotations: book.annotations || []
        }));
        console.log('Books loaded:', this.books);
      },
      error: (err) => {
        console.error('Error fetching books:', err);
      }
    });
  }

  addBook(): void {
    const bookToAdd = { ...this.newBook, userId: this.UserId };
    this.bookService.addBook(bookToAdd).subscribe({
      next: (data) => {
        this.books.push(data);
        this.newBook = { tittle: '', author: '', year: null, genre: '' };
        this.AddBookForm = false;
      },
      error: (err) => {
        console.error('Error adding book:', err);
      }
    });
  }
  //eliminar libro y las anotaciones asociadas
  deleteBook(bookId: number): void {
    // Confirmación antes de eliminar el libro
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este libro? Esta acción borrará todas las anotaciones del libro.');
  if (!confirmDelete) {
    return;
  }
    this.bookService.deleteBook(bookId).subscribe({
      next: () => {
        this.getBooks(); // Actualiza la lista de libros después de eliminar
      },
      error: (err) => {
        console.error('Error deleting book:', err);
      }
    });
  }

  updateBook(bookId: number): void {
    const bookToUpdate = this.books.find(book => book.bookId === bookId);
    if (!bookToUpdate) {
      console.error('Book not found');
      return;
    }

    const updatedData = {
      title: bookToUpdate.title,
      author: bookToUpdate.author,
      year: bookToUpdate.year,
      genre: bookToUpdate.genre
    };

    this.bookService.updateBook(bookId, updatedData).subscribe({
      next: () => {
        alert('Book updated successfully');
      },
      error: (err) => {
        console.error('Error updating book:', err);
      }
    });
  }

  toggleEditBook(bookId: number): void {
    this.editingBookId = this.editingBookId === bookId ? null : bookId;
  }
  selectBook(book: any): void {
    this.bookSelected.emit(book.bookId);
  }
}