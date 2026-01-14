import { Note } from '../domain/note.entity';

export interface NotesRepository {
  // Traer todas (opcionalmente con filtros) [cite: 14]
  findAll(): Promise<Note[]>; 
  
  // Buscar una específica por ID [cite: 15]
  findById(id: string): Promise<Note | null>;
  
  // Crear nota
  create(note: Note): Promise<Note>;
  
  // Editar nota
  update(id: string, data: Partial<Note>): Promise<Note | null>;
  
  // Eliminar una o varias notas [cite: 22]
  delete(ids: string[]): Promise<boolean>;
}