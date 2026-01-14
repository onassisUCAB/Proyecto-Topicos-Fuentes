import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    create(createNoteDto: CreateNoteDto): Promise<import("./domain/note.entity").Note>;
    findAll(sort?: 'title' | 'date', order?: 'asc' | 'desc'): Promise<import("./domain/note.entity").Note[]>;
    findOne(id: string): Promise<import("./domain/note.entity").Note>;
    update(id: string, updateNoteDto: UpdateNoteDto): Promise<import("./domain/note.entity").Note>;
    remove(id: string): Promise<boolean>;
}
