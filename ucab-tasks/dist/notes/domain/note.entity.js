"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
class Note {
    id;
    title;
    content;
    createdAt;
    updatedAt;
    constructor(id, title, content) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    update(title, content) {
        if (title)
            this.title = title;
        if (content)
            this.content = content;
        this.updatedAt = new Date();
    }
}
exports.Note = Note;
//# sourceMappingURL=note.entity.js.map