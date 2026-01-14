import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { NotesRepository } from '../notes/interfaces/notes-repository.interface';
import { Note } from '../notes/domain/note.entity';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileNotesRepository implements NotesRepository {
  // Ruta donde se guardará el archivo JSON (en la raíz del proyecto)
  private readonly filePath = path.join(process.cwd(), 'notes-data.json');

  // Helper: Cargar notas del archivo
  private async loadNotes(): Promise<Note[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as Note[];
    } catch (error) {
      // Si el archivo no existe, retornamos un array vacío (primera ejecución)
      if ((error as any).code === 'ENOENT') {
        return [];
      }
      throw new InternalServerErrorException('No se pudo leer el archivo de base de datos');
    }
  }

  // Helper: Guardar notas en el archivo
  private async saveNotes(notes: Note[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(notes, null, 2));
  }

  async findAll(): Promise<Note[]> {
    return this.loadNotes();
  }

  async findById(id: string): Promise<Note | null> {
    const notes = await this.loadNotes();
    return notes.find((n) => n.id === id) || null;
  }

  async create(note: Note): Promise<Note> {
    const notes = await this.loadNotes();
    notes.push(note);
    await this.saveNotes(notes);
    return note;
  }

  async update(id: string, data: Partial<Note>): Promise<Note | null> {
    const notes = await this.loadNotes();
    const index = notes.findIndex((n) => n.id === id);

    if (index === -1) return null;

    const originalNote = notes[index];

    // 1. Creamos el objeto fusionando los datos viejos con los nuevos
    const updatedNoteRaw = {
      ...originalNote,
      ...data,
      updatedAt: new Date(),
    };

    // 2. IMPORTANTE: Convertimos ese objeto plano en una instancia real de la clase Note
    // Esto conecta los métodos (como .update()) al objeto
    Object.setPrototypeOf(updatedNoteRaw, Note.prototype);

    // 3. Usamos 'as Note' para calmar a TypeScript
    const finalNote = updatedNoteRaw as Note;

    notes[index] = finalNote;
    await this.saveNotes(notes);
    
    return finalNote;
  }

  async delete(ids: string[]): Promise<boolean> {
    let notes = await this.loadNotes();
    const initialLength = notes.length;
    
    // Filtramos para dejar solo las que NO estén en la lista de IDs a borrar
    notes = notes.filter(n => !ids.includes(n.id));

    if (notes.length === initialLength) return false; // No se borró nada

    await this.saveNotes(notes);
    return true;
  }
}