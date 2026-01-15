import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { NotesRepository } from '../notes/interfaces/notes-repository.interface';
import { Note } from '../notes/domain/note.entity';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Implementación de NotesRepository, que usa un archivo JSON para guardar las notas.
 * Maneja la persistencia de notas en el sistema de archivos local.
 * 
 * @class FileNotesRepository
 */
@Injectable()
export class FileNotesRepository implements NotesRepository {
  // Ruta donde se guardará el archivo JSON (en la raíz del proyecto)
  private readonly filePath = path.join(process.cwd(), 'notes-data.json');

  /**
   * Carga todas las notas desde el archivo JSON.
   * Si el archivo no existe, retorna un array vacío (primera ejecución).
   * 
   * @private
   * @async
   * @returns {Promise<Note[]>} Array de notas cargadas desde el archivo
   * @throws {InternalServerErrorException} Cuando ocurre un error de lectura diferente a "archivo no encontrado"
   */
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

  /**
  * Guarda el array de notas en el archivo JSON.
  * 
  * @private
  * @async
  * @param {Note[]} notes - Array de notas a guardar
  * @returns {Promise<void>}
  */
  private async saveNotes(notes: Note[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(notes, null, 2));
  }

  /**
   * Obtiene todas las notas almacenadas.
   * 
   * @async
   * @returns {Promise<Note[]>} Array con todas las notas
   */
  async findAll(): Promise<Note[]> {
    return this.loadNotes();
  }

    /**
   * Busca una nota por su ID.
   * 
   * @async
   * @param {string} id - Identificador único de la nota
   * @returns {Promise<Note | null>} La nota encontrada o null si no existe
   */
  async findById(id: string): Promise<Note | null> {
    const notes = await this.loadNotes();
    return notes.find((n) => n.id === id) || null;
  }

  /**
   * Crea una nueva nota y la guarda en el archivo.
   * 
   * @async
   * @param {Note} note - Objeto nota a crear
   * @returns {Promise<Note>} La nota creada
   */
  async create(note: Note): Promise<Note> {
    const notes = await this.loadNotes();
    notes.push(note);
    await this.saveNotes(notes);
    return note;
  }

  /**
  * Actualiza una nota existente por su ID.
  * Actualiza automáticamente la fecha de modificación (updatedAt).
  * Restaura el prototipo de la clase Note para mantener los métodos.
  * 
  * @async
  * @param {string} id - Identificador único de la nota a actualizar
  * @param {Partial<Note>} data - Objeto con los campos a actualizar
  * @returns {Promise<Note | null>} La nota actualizada o null si no se encontró
  */
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

  /**
  * Elimina una o varias notas por sus IDs.
  * 
  * @async
  * @param {string[]} ids - Array de identificadores de notas a eliminar
  * @returns {Promise<boolean>} true si se eliminó al menos una nota, false si no se eliminó ninguna
  */
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