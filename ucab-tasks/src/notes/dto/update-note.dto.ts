import { PartialType } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto';

// PartialType hace que title y content sean opcionales para la edición
export class UpdateNoteDto extends PartialType(CreateNoteDto) {}