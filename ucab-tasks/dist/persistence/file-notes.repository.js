"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileNotesRepository = void 0;
const common_1 = require("@nestjs/common");
const note_entity_1 = require("../notes/domain/note.entity");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
let FileNotesRepository = class FileNotesRepository {
    filePath = path.join(process.cwd(), 'notes-data.json');
    async loadNotes() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw new common_1.InternalServerErrorException('No se pudo leer el archivo de base de datos');
        }
    }
    async saveNotes(notes) {
        await fs.writeFile(this.filePath, JSON.stringify(notes, null, 2));
    }
    async findAll() {
        return this.loadNotes();
    }
    async findById(id) {
        const notes = await this.loadNotes();
        return notes.find((n) => n.id === id) || null;
    }
    async create(note) {
        const notes = await this.loadNotes();
        notes.push(note);
        await this.saveNotes(notes);
        return note;
    }
    async update(id, data) {
        const notes = await this.loadNotes();
        const index = notes.findIndex((n) => n.id === id);
        if (index === -1)
            return null;
        const originalNote = notes[index];
        const updatedNoteRaw = {
            ...originalNote,
            ...data,
            updatedAt: new Date(),
        };
        Object.setPrototypeOf(updatedNoteRaw, note_entity_1.Note.prototype);
        const finalNote = updatedNoteRaw;
        notes[index] = finalNote;
        await this.saveNotes(notes);
        return finalNote;
    }
    async delete(ids) {
        let notes = await this.loadNotes();
        const initialLength = notes.length;
        notes = notes.filter(n => !ids.includes(n.id));
        if (notes.length === initialLength)
            return false;
        await this.saveNotes(notes);
        return true;
    }
};
exports.FileNotesRepository = FileNotesRepository;
exports.FileNotesRepository = FileNotesRepository = __decorate([
    (0, common_1.Injectable)()
], FileNotesRepository);
//# sourceMappingURL=file-notes.repository.js.map