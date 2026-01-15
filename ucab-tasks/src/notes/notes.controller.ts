import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { NotesService } from './notes.service'; 
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ExcludeContentInterceptor } from '../common/interceptors/exclude-content.interceptor'; // Ajusta la ruta

/**
 * Controlador REST para la gestión de las notas.
 * Da endpoints para crear, leer, actualizar y eliminar notas.
 * Integra la documentación automática de Swagger.
 * @class NotesController
 * @ApiTags('Notes') - Agrupa los endpoints bajo "Notes" en Swagger
 * @Controller('notes') - Define el prefijo de ruta /notes
*/
@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva nota' })
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  // AQUI APLICAMOS EL ASPECTO (Requisito: Listado sin contenido)
  @Get()
  @UseInterceptors(ExcludeContentInterceptor) 
  @ApiOperation({ summary: 'Obtener todas las notas (sin contenido)' })
  @ApiQuery({ name: 'sort', required: false, enum: ['title', 'date'] })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  findAll(
    @Query('sort') sort?: 'title' | 'date',
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.notesService.findAll(sort, order);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una nota específica (con contenido)' })
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar título o contenido de una nota' })
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id') // También acepta varios IDs separados por coma si ajustamos la lógica
  @ApiOperation({ summary: 'Eliminar una nota' })
  remove(@Param('id') id: string) {
    return this.notesService.remove(id);
  }
}