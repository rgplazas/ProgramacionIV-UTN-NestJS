import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipe(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/registro (POST) - debería registrar un usuario', () => {
    return request(app.getHttpServer())
      .post('/auth/registro')
      .send({
        nombre: 'Test',
        apellido: 'User',
        email: 'test@utn.edu.ar',
        password: 'test1234',
        rol: 'ADMIN',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.token).toBeDefined();
        expect(res.body.usuario.email).toBe('test@utn.edu.ar');
        token = res.body.token;
      });
  });

  it('/auth/login (POST) - debería iniciar sesión', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@utn.edu.ar', password: 'test1234' })
      .expect(200)
      .expect((res) => {
        expect(res.body.token).toBeDefined();
      });
  });

  it('/auth/perfil (GET) - debería requerir autenticación', () => {
    return request(app.getHttpServer())
      .get('/auth/perfil')
      .expect(401);
  });

  it('/auth/perfil (GET) - debería retornar perfil con token', () => {
    return request(app.getHttpServer())
      .get('/auth/perfil')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe('test@utn.edu.ar');
      });
  });
});
