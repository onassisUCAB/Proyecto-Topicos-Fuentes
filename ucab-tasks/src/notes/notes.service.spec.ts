import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { NotFoundException } from '@nestjs/common';
import { Note } from './domain/note.entity';
import type { NotesRepository } from './interfaces/notes-repository.interface';

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};


describe('NotesService', () => {
  let service: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: 'NotesRepository', useValue: mockRepo },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
