import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludeContentInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        // Si la respuesta es un arreglo (Lista de notas), borramos el contenido de c/u
        if (Array.isArray(data)) {
          return data.map(note => {
            const { content, ...rest } = note; // Sacamos 'content', dejamos el resto
            return rest;
          });
        }
        // Si no es un arreglo (es una sola nota), la dejamos tal cual (con contenido)
        return data;
      })
    );
  }
}