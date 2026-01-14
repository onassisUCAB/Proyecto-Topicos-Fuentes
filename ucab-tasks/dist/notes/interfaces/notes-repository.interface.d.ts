import { Note } from '../domain/note.entity';
export interface NotesRepository {
    findAll(): Promise<Note[]>;
    findById(id: string): Promise<Note | null>;
    create(note: Note): Promise<Note>;
    update(id: string, data: Partial<Note>): Promise<Note | null>;
    delete(ids: string[]): Promise<boolean>;
}
