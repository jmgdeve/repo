import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'http://localhost:8080/books'; // URL de BookController

  constructor(private http: HttpClient) { }

  getBooks(UserId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${UserId}`);
  }
  addBook(book: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, book);
  }
  deleteBook(bookId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${bookId}`);
  }
  updateBook(bookId: number, bookData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${bookId}`, bookData);
  }
}
