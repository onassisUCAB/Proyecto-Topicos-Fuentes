/**
 * Clase que representa una nota en el sistema.
 * Cuentan con un ID, título, contenido, fecha de creación y fecha de última modificación.
 * @class Note
 * @example
 * // Crear una nueva nota
 * const note = new Note('uuid-123', 'Mi primera nota', 'Contenido de la nota');
 * 
 * // Actualizar la nota
 * note.update('Título actualizado', 'Nuevo contenido');
 */
export class Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Crea una instancia de una Nota.
   * Inicializa automáticamente las fechas de creación y modificación.
   * 
   * @constructor
   * @param {string} id - Identificador único para la nota
   * @param {string} title - Título de la nota
   * @param {string} content - Contenido de la nota
   * @example
   * const note = new Note('123e4567-e89b-12d3-a456-426614174000', 'Título', 'Contenido');
   */
  constructor(id: string, title: string, content: string) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
  * Actualiza los campos de la nota y refresca automáticamente la fecha de modificación.
  * 
  * @method update
  * @param {string} [title] - Nuevo título para la nota (opcional)
  * @param {string} [content] - Nuevo contenido para la nota (opcional)
  * @returns {void}
  * @example
  * // Actualizar solo el título
  * note.update('Nuevo título');
  * 
  * // Actualizar solo el contenido
  * note.update(undefined, 'Nuevo contenido');
  * 
  * // Actualizar ambos
  * note.update('Nuevo título', 'Nuevo contenido');
  */
  update(title?: string, content?: string) {
    if (title) this.title = title;
    if (content) this.content = content;
    this.updatedAt = new Date(); // Requisito: actualizar fecha mod.
  }
}