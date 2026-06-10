import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://tu-frontend.vercel.app']
        : ['http://localhost:4200', 'http://localhost:3000'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API Gestion de Inventario - Clase 5')
    .setDescription(
      'API REST con subida de imagenes a Cloudinary mediante Multer. ' +
      'Incluye autenticacion JWT, roles ADMIN/USER y documentacion OpenAPI completa.',
    )
    .setVersion('5.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingresar el token JWT obtenido en POST /auth/login',
      },
      'access-token',
    )
    .addTag('Autenticacion', 'Registro e inicio de sesion')
    .addTag('Productos', 'CRUD de productos con subida de imagen a Cloudinary')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'API Inventario Clase 5 - Docs',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Servidor:    http://localhost:${port}`);
  console.log(`Swagger UI:  http://localhost:${port}/api/docs`);
}
bootstrap();
