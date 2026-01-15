import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interceptor que excluye el campo 'content' de las notas en respuestas de tipo array.
 * 
 * Modificar las respuestas HTTP para remover el campo 'content'
 * cuando la respuesta contiene un array de notas.
 * 
 * @class ExcludeContentInterceptor
 * @implements {NestInterceptor}
 * @injectable
 * @example
 * // Uso en un controlador
 * @UseInterceptors(ExcludeContentInterceptor)
 * @Get()
 * findAll() {
 *   return this.notesService.findAll();
 * }
 * 
 * @example
 * // Uso global en el módulo
 * providers: [
 *   {
 *     provide: APP_INTERCEPTOR,
 *     useClass: ExcludeContentInterceptor
 *   }
 * ]
 */
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