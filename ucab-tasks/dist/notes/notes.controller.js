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
exports.NotesController = void 0;
const common_1 = require("@nestjs/common");
const notes_service_1 = require("./notes.service");
const create_note_dto_1 = require("./dto/create-note.dto");
const update_note_dto_1 = require("./dto/update-note.dto");
const swagger_1 = require("@nestjs/swagger");
const exclude_content_interceptor_1 = require("../common/interceptors/exclude-content.interceptor");
let NotesController = class NotesController {
    notesService;
    constructor(notesService) {
        this.notesService = notesService;
    }
    create(createNoteDto) {
        return this.notesService.create(createNoteDto);
    }
    findAll(sort, order) {
        return this.notesService.findAll(sort, order);
    }
    findOne(id) {
        return this.notesService.findOne(id);
    }
    update(id, updateNoteDto) {
        return this.notesService.update(id, updateNoteDto);
    }
    remove(id) {
        return this.notesService.remove(id);
    }
};
exports.NotesController = NotesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva nota' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_note_dto_1.CreateNoteDto]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseInterceptors)(exclude_content_interceptor_1.ExcludeContentInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las notas (sin contenido)' }),
    (0, swagger_1.ApiQuery)({ name: 'sort', required: false, enum: ['title', 'date'] }),
    (0, swagger_1.ApiQuery)({ name: 'order', required: false, enum: ['asc', 'desc'] }),
    __param(0, (0, common_1.Query)('sort')),
    __param(1, (0, common_1.Query)('order')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una nota específica (con contenido)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar título o contenido de una nota' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_note_dto_1.UpdateNoteDto]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una nota' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "remove", null);
exports.NotesController = NotesController = __decorate([
    (0, swagger_1.ApiTags)('Notes'),
    (0, common_1.Controller)('notes'),
    __metadata("design:paramtypes", [notes_service_1.NotesService])
], NotesController);
//# sourceMappingURL=notes.controller.js.map