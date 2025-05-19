import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnotationService {

  private apiUrl = 'http://localhost:8080/annotations'; // URL del controlador de anotaciones en el backend

  constructor(private http: HttpClient) { }

  // Obtener anotaciones de un libro específico
  getAnnotationsByBook(bookId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/annotation/${bookId}`);
  }

  // Añadir una nueva anotación a un libro
  addAnnotationToBook(bookId: number, annotation: {text: string, page: string}): Observable<any> {
    console.log  ('Adding annotation:', { bookId, annotation });
    return this.http.post<any>(`${this.apiUrl}/add/${bookId}`, annotation);
    
  }
  deleteAnnotation(annotationId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${annotationId}`);
  }
}
