import { HttpInterceptorFn } from '@angular/common/http';
//intercepta todas las peticiones y le añade un token de autorización si existe en el localStorage
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};