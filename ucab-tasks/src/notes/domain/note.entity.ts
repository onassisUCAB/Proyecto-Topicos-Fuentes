export class Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, title: string, content: string) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Método para actualizar la nota y refrescar la fecha automáticamente
  update(title?: string, content?: string) {
    if (title) this.title = title;
    if (content) this.content = content;
    this.updatedAt = new Date(); // Requisito: actualizar fecha mod.
  }
}