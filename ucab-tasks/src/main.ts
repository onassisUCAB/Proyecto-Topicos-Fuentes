import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Función para entrar en la aplicación backend de NestJS.
 * Esto incluye las configuraciones como los Data Transfer Objects,
 * el Cross-Origin Resource Sharing (CORS) y la documentación Swagger.
 * 
 * @returns void
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Activamos la validación global (para que funcionen los DTOs)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina campos que no estén en el DTO
    forbidNonWhitelisted: true, // Tira error si mandan campos extra
  }));

  // 2. Activamos CORS (por si el frontend lo necesita luego)
  app.enableCors();

  // 3. Configuración de Swagger (Documentación Automática)
  const config = new DocumentBuilder()
    .setTitle('UCAB Tasks API')
    .setDescription('API para la gestión de notas del proyecto de Tópicos Especiales')
    .setVersion('1.0')
    .addTag('Notes')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // La documentación estará en /api

  await app.listen(3000);
  console.log('🚀 Servidor corriendo en: http://localhost:3000/api');
}
bootstrap();