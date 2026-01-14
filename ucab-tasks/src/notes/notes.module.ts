import { Module } from '@nestjs/common';
import { NotesService } from './notes.service'; // Asegúrate de que la ruta sea correcta (puede ser ./notes.service si no creaste la carpeta services)
import { NotesController } from './notes.controller';
import { FileNotesRepository } from '../persistence/file-notes.repository';

@Module({
  controllers: [NotesController],
  providers: [
    NotesService,
    // AQUÍ ESTÁ LA CLAVE: Inyección de dependencias usando un Token
    {
      provide: 'NotesRepository', // Este es el nombre que usaremos en el Servicio
      useClass: FileNotesRepository,
    },
  ],
})
export class NotesModule {}