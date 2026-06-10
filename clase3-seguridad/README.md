# Gestión de Inventario - Clase 3: Seguridad JWT

## Descripción
API REST con autenticación JWT completa: registro, login, roles (ADMIN/USER), guards de protección de rutas, rate limiting y CORS.

## Stack
- NestJS 11.x
- MongoDB + Mongoose
- Passport + JWT Strategy
- bcryptjs (hash de contraseñas)
- @nestjs/throttler (rate limiting)
- Helmet (headers de seguridad)

## Instalación
```bash
npm install
cp .env.example .env
# Editar .env con tu configuración
```

## Ejecución
```bash
npm run start:dev
```

## Flujo de autenticación
1. **Registro**: `POST /auth/registro` → crea usuario con contraseña hasheada
2. **Login**: `POST /auth/login` → devuelve JWT access token
3. **Peticiones**: Incluir header `Authorization: Bearer <token>`
4. **Acceso**: Guards verifican token y roles

## Endpoints Públicos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /auth/registro | Registrar nuevo usuario |
| POST | /auth/login | Iniciar sesión |
| GET | /productos | Listar productos (público) |
| GET | /productos/:id | Ver producto (público) |

## Endpoints Protegidos (requieren JWT)
| Método | Endpoint | Rol requerido |
|--------|----------|---------------|
| POST | /productos | ADMIN |
| PUT | /productos/:id | ADMIN |
| DELETE | /productos/:id | ADMIN |
| GET | /auth/perfil | Cualquiera (autenticado) |
| GET | /auth/admin | Solo ADMIN |

## Ejemplos (curl)
```bash
# 1. Registro
curl -X POST http://localhost:3000/auth/registro \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","apellido":"Perez","email":"juan@utn.edu.ar","password":"secreto123","rol":"ADMIN"}'

# 2. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@utn.edu.ar","password":"secreto123"}'
# Respuesta: {"access_token":"eyJhbGci..."}

# 3. Crear producto (ADMIN)
curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGci..." \
  -d '{"nombre":"Teclado","precio":100,"stock":5,"categoria":"Periféricos"}'

# 4. Ver perfil
curl http://localhost:3000/auth/perfil \
  -H "Authorization: Bearer eyJhbGci..."
```
