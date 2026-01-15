"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
const note_entity_1 = require("./domain/note.entity");
const uuid_1 = require("uuid");
let NotesService = class NotesService {
    notesRepository;
    constructor(notesRepository) {
        this.notesRepository = notesRepository;
    }
    async create(createNoteDto) {
        const id = (0, uuid_1.v4)();
        const newNote = new note_entity_1.Note(id, createNoteDto.title, createNoteDto.content);
        return this.notesRepository.create(newNote);
    }
    async findAll(sort, order = 'asc') {
        const notes = await this.notesRepository.findAll();
        if (sort) {
            notes.sort((a, b) => {
                if (sort === 'title') {
                    return order === 'asc'
                        ? a.title.localeCompare(b.title)
                        : b.title.localeCompare(a.title);
                }
                else if (sort === 'date') {
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    return order === 'asc' ? dateA - dateB : dateB - dateA;
                }
                return 0;
            });
        }
        return notes;
    }
    async findOne(id) {
        const note = await this.notesRepository.findById(id);
        if (!note) {
            throw new common_1.NotFoundException(`La nota con ID ${id} no existe`);
        }
        return note;
    }
    async update(id, updateNoteDto) {
        await this.findOne(id);
        const updatedNote = await this.notesRepository.update(id, updateNoteDto);
        return updatedNote;
    }
    async remove(ids) {
        const idsArray = Array.isArray(ids) ? ids : [ids];
        return this.notesRepository.delete(idsArray);
    }
};
exports.NotesService = NotesService;
exports.NotesService = NotesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('NotesRepository')),
    __metadata("design:paramtypes", [Object])
], NotesService);
//# sourceMappingURL=notes.service.js.map