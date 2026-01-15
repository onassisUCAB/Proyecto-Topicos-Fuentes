import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './domain/note.entity';
import type { NotesRepository } from './interfaces/notes-repository.interface';
export declare class NotesService {
    private readonly notesRepository;
    constructor(notesRepository: NotesRepository);
    create(createNoteDto: CreateNoteDto): Promise<Note>;
    findAll(sort?: 'title' | 'date', order?: 'asc' | 'desc'): Promise<Note[]>;
    findOne(id: string): Promise<Note>;
    update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note>;
    remove(ids: string | string[]): Promise<boolean>;
}
