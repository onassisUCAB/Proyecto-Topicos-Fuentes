import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './domain/note.entity';
import type { NotesRepository } from './interfaces/notes-repository.interface';
import { v4 as uuidv4 } from 'uuid'; // Librería para IDs únicos

/**
 * Servicio para la gestión CRUD de las notas.
 * @class NotesService
 */
@Injectable()
export class NotesService {
  constructor(
    // Inyectamos el Repositorio usando el token que definimos en el Module
    @Inject('NotesRepository')
    private readonly notesRepository: NotesRepository,
  ) {}

  /**
   * Crear una nueva nota.
   * @param createNoteDto Datos de la nota
   * @returns {Promise<Note>}
   */
  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    // 1. Generamos un ID único
    const id = uuidv4();
    
    // 2. Creamos la instancia de la Nota
    const newNote = new Note(id, createNoteDto.title, createNoteDto.content);
    
    // 3. Guardamos usando el repositorio
    return this.notesRepository.create(newNote);
  }

  /**
   * Obtener todas las notas, con opción de ordenamiento.
   * @param sort ordenar según título o fecha
   * @param order orden ascendente o descendente
   * @returns {Promise<Note[]>}
   */
  async findAll(sort?: 'title' | 'date', order: 'asc' | 'desc' = 'asc'): Promise<Note[]> {
    const notes = await this.notesRepository.findAll();

    // Lógica de Ordenamiento (Requisito del PDF)
    if (sort) {
      notes.sort((a, b) => {
        if (sort === 'title') {
          return order === 'asc' 
            ? a.title.localeCompare(b.title) 
            : b.title.localeCompare(a.title);
        } else if (sort === 'date') {
          // Ordenar por fecha de creación
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return order === 'asc' ? dateA - dateB : dateB - dateA;
        }
        return 0;
      });
    }

    return notes;
  }

  /**
   * Buscar una nota por su ID.
   * @param id id de la nota
   * @returns {Promise<Note>}
   * @throws {NotFoundException} Si la nota no existe
   */
  async findOne(id: string): Promise<Note> {
    const note = await this.notesRepository.findById(id);
    if (!note) {
      throw new NotFoundException(`La nota con ID ${id} no existe`);
    }
    return note;
  }

  /**
   * Modificar una nota existente
   * @param id de la nota a modificar
   * @param updateNoteDto Datos a modificar
   * @returns {Promise<Note>}
   */
  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    // Verificamos que exista primero
    await this.findOne(id);
    
    const updatedNote = await this.notesRepository.update(id, updateNoteDto);
    return updatedNote!;
  }

  /**
   * Eliminar una o varias notas por su ID
   * @param ids de la/s nota/s a eliminar
   * @returns 
   */
  async remove(ids: string | string[]): Promise<boolean> {
    // El requisito dice que puede aceptar "uno o varios identificadores"
    // Convertimos a array si viene un solo string
    const idsArray = Array.isArray(ids) ? ids : [ids];
    
    return this.notesRepository.delete(idsArray);
  }
}
