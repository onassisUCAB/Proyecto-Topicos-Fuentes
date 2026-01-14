import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({ description: 'El título de la nota' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'El contenido principal de la nota' })
  @IsString()
  @IsNotEmpty()
  content: string;
}