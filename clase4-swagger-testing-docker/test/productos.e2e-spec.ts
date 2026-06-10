import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ProductosController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let productoId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipe(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();

    // Crear usuario admin y loguearse
    await request(app.getHttpServer()).post('/auth/registro').send({
      nombre: 'Admin', apellido: 'Test', email: 'admin@test.com', password: 'admin123', rol: 'ADMIN',
    });
    const login = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'admin@test.com', password: 'admin123',
    });
    token = login.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/productos (GET) - listar productos público', () => {
    return request(app.getHttpServer())
      .get('/productos')
      .expect(200);
  });

  it('/productos (POST) - crear producto requiere auth', () => {
    return request(app.getHttpServer())
      .post('/productos')
      .send({ nombre: 'Test', precio: 100, stock: 5, categoria: 'Test' })
      .expect(401);
  });

  it('/productos (POST) - crear producto con token', () => {
    return request(app.getHttpServer())
      .post('/productos')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Monitor 4K', precio: 599.99, stock: 8, categoria: 'Electrónica' })
      .expect(201)
      .expect((res) => {
        expect(res.body.nombre).toBe('Monitor 4K');
        productoId = res.body._id;
      });
  });

  it('/productos/:id (GET) - obtener producto creado', () => {
    return request(app.getHttpServer())
      .get(`/productos/${productoId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.nombre).toBe('Monitor 4K');
      });
  });

  it('/productos/:id (DELETE) - eliminar producto con token', () => {
    return request(app.getHttpServer())
      .delete(`/productos/${productoId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });
});
