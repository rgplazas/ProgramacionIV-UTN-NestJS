# Gestión de Inventario - Clase 4: Swagger, Testing, Docker y Deploy

## Descripción
Proyecto final completo con documentación Swagger automática, testing unitario y E2E, Docker multi-stage y configuración para deploy en Render/Railway.

## Stack
- NestJS 11.x + Swagger/OpenAPI
- MongoDB + Mongoose
- Passport JWT + bcryptjs
- Jest (unit + E2E) + mongodb-memory-server
- Docker + Docker Compose

## Instalación
```bash
npm install
cp .env.example .env
# Editar .env con tu configuración
```

## Ejecución

### Desarrollo local
```bash
npm run start:dev
```

### Con Docker
```bash
# Construir y levantar
docker-compose up --build

# Solo MongoDB
docker-compose up mongo
```

### Tests
```bash
# Unit tests
npm test

# Con coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Documentación Swagger
Una vez levantado el servidor, acceder a:
- **Swagger UI**: http://localhost:3000/api/docs
- **OpenAPI JSON**: http://localhost:3000/api/docs-json

## Deploy en Render (gratuito)
1. Crear cuenta en https://render.com
2. New Web Service → conectar repositorio GitHub
3. Configurar:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
4. Agregar variables de entorno
5. Deploy automático en cada push

## Deploy en Railway
```bash
npm install -g railway
railway login
railway init
railway add --database mongodb
railway up
```

## Estructura del proyecto
```
src/
├── auth/          # Autenticación JWT + Swagger decorators
├── productos/     # CRUD con documentación Swagger
├── users/         # Gestión de usuarios
├── app.module.ts
└── main.ts        # Configuración Swagger
test/
├── productos.e2e-spec.ts   # Tests E2E de productos
├── auth.e2e-spec.ts        # Tests E2E de autenticación
└── jest-e2e.json           # Configuración Jest E2E
Dockerfile
docker-compose.yml
```
