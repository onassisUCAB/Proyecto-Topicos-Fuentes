import { NotesRepository } from '../notes/interfaces/notes-repository.interface';
import { Note } from '../notes/domain/note.entity';
export declare class FileNotesRepository implements NotesRepository {
    private readonly filePath;
    private loadNotes;
    private saveNotes;
    findAll(): Promise<Note[]>;
    findById(id: string): Promise<Note | null>;
    create(note: Note): Promise<Note>;
    update(id: string, data: Partial<Note>): Promise<Note | null>;
    delete(ids: string[]): Promise<boolean>;
}
