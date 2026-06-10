import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Headers de seguridad
  app.use(helmet());

  // Validación global
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  // CORS
  app.enableCors({
    origin: process.env.NODE_ENV === 'production'
      ? ['https://tu-frontend.vercel.app']
      : ['http://localhost:4200', 'http://localhost:3000'],
    credentials: true,
  });

  // Configuración Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('API Gestión de Inventario')
    .setDescription('API REST completa para gestión de productos con autenticación JWT')
    .setVersion('4.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Ingrese el token JWT' },
      'access-token',
    )
    .addTag('Autenticación', 'Registro e inicio de sesión')
    .addTag('Productos', 'Gestión de productos del inventario')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'API Inventario - Docs',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Servidor: http://localhost:${port}`);
  console.log(`Swagger UI: http://localhost:${port}/api/docs`);
}
bootstrap();
