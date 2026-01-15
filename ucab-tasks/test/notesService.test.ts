import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NotesService } from '../src/notes/notes.service';
import { Note } from '../src/notes/domain/note.entity';
import type { NotesRepository } from '../src/notes/interfaces/notes-repository.interface';

const mockNotesRepository: NotesRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const createMockNote = (id: string, title: string, content: string): Note => {
  return new Note(id, title, content);
}

describe('NotesService', () => {
  let service: NotesService;
  let repository: jest.Mocked<NotesRepository>;

  beforeEach(async () => {
    let service: NotesService;
    let repository: jest.Mocked<NotesRepository>;

    beforeEach(async () => {
      jest.clearAllMocks();

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          NotesService,
          { provide: 'NotesRepository', useValue: mockNotesRepository },
        ],
      }).compile();

      service = module.get<NotesService>(NotesService);
      repository = module.get('NotesRepository') as jest.Mocked<NotesRepository>;
    });

    describe('create', () => {
      it('should create and return a new note', async () => {
        const createNoteDto = { title: 'Test Note', content: 'This is a test note.' };

        const mockNote = createMockNote('123', createNoteDto.title, createNoteDto.content);
        repository.create.mockResolvedValue(mockNote);

        const result = await service.create(createNoteDto);

        expect(result).toEqual(mockNote);
        expect(repository.create).toHaveBeenCalledTimes(1);
        expect(repository.create).toHaveBeenCalledWith(expect.any(Note));
      });
    });

    describe('findAll', () => {
      it('should return all notes', async () => {
        const mockNotes = [
          createMockNote('1', 'Note 1', 'Content 1'),
          createMockNote('2', 'Note 2', 'Content 2'),
        ];
        repository.findAll.mockResolvedValue(mockNotes);
        
        const result = await service.findAll();

        expect(result).toEqual(mockNotes);
        expect(repository.findAll).toHaveBeenCalledTimes(1);
      });

      it('should return notes sorted by title in ascending order', async () => {
        const mockNotes = [
          createMockNote('2', 'Banana', 'Content 2'),
          createMockNote('1', 'Apple', 'Content 1'),
        ];
        repository.findAll.mockResolvedValue(mockNotes);

        const result = await service.findAll('title', 'asc');

        expect(result[0].title).toBe('Apple');
        expect(result[1].title).toBe('Banana');
      });

      it('should return notes sorted by title in descending order', async () => {
        const mockNotes = [
          createMockNote('1', 'Apple', 'Content 1'),
          createMockNote('2', 'Banana', 'Content 2'),
        ];
        repository.findAll.mockResolvedValue(mockNotes);

        const result = await service.findAll('date', 'asc');

        expect(result[0].title).toBe('Banana');
        expect(result[1].title).toBe('Apple');
      });
    });

    describe('findOne', () => {
      it('should return a note when it exists', async () => {
        const mockNote = createMockNote('1', 'Note 1', 'Content 1');
        repository.findById.mockResolvedValue(mockNote);

        const result = await service.findOne('1');

        expect(result).toEqual(mockNote);
        expect(repository.findById).toHaveBeenCalledWith('1');
      });

      it('should throw NotFoundException when note does not exist', async () => {
        repository.findById.mockResolvedValue(null);

        await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
        await expect(service.findOne('999')).rejects.toThrow('La nota con ID 999 no existe');
      });
    });

    describe('update', () => {
      it('should update and return a note successfully', async () => {
        const mockNote = createMockNote('1', 'Note 1', 'Content 1');
        const updatedNoteDto = {
          title: 'Updated Note 1',
          content: 'Updated Content 1',
        };

        const updatedNote = new Note('1', updatedNoteDto.title, updatedNoteDto.content);

        updatedNote.createdAt = mockNote.createdAt; // Preserve createdAt

        repository.findById.mockResolvedValue(mockNote);
        repository.update.mockResolvedValue(updatedNote);
        const result = await service.update('1', updatedNoteDto);

        expect(result).toEqual(updatedNote);
        expect(repository.findById).toHaveBeenCalledWith('1');
        expect(repository.update).toHaveBeenCalledWith('1', updatedNoteDto);
      });

      it('should throw NotFoundException id note to update does not exist', async () => {
        repository.findById.mockResolvedValue(null);

        await expect(service.update('999', { title: 'New' })).rejects.toThrow(NotFoundException);
      });
    });

    describe('remove', () => {
      it('should remove a single notes', async () => {
        const noteId = '123';
        repository.delete.mockResolvedValue(true);

        const result = await service.remove(noteId);

        expect(result).toBe(true);
        expect(repository.delete).toHaveBeenCalledWith([noteId]);
      });

      it('should remove multiple notes', async () => {
        const noteIds = ['123', '456', '789'];
        repository.delete.mockResolvedValue(true);

        const result = await service.remove(noteIds);

        expect(result).toBe(true);
        expect(repository.delete).toHaveBeenCalledWith(noteIds);
      });

      it('should return false if deletion fails', async () => {
        repository.delete.mockResolvedValue(false);

        const result = await service.remove('123');
        expect(result).toBe(false);
      });
    });
  });
});