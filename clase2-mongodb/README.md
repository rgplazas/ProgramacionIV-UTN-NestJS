# Gestión de Inventario - Clase 2: MongoDB y Mongoose

## Descripción
API REST con persistencia en MongoDB usando Mongoose. Evolución del Proyecto 1 (array en memoria → MongoDB real).

## Stack
- NestJS 11.x
- MongoDB 8.x + Mongoose 8.x
- @nestjs/mongoose

## Instalación
```bash
npm install
```

## Configuración
1. Copiar `.env.example` a `.env`
2. Configurar `MONGODB_URI` con tu cluster de MongoDB Atlas (o local)

## Ejecución
```bash
# Desarrollo
npm run start:dev

# Seed de datos
npm run seed
```

## Endpoints
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /productos | Listar con paginación |
| GET | /productos/:id | Obtener por ID |
| POST | /productos | Crear |
| PUT | /productos/:id | Actualizar completo |
| PATCH | /productos/:id | Actualizar parcial |
| DELETE | /productos/:id | Soft delete |
| GET | /productos/buscar?q=xxx | Buscar por nombre |

## Seed de datos
```bash
npm run seed
```
Carga 10 productos de ejemplo en la base de datos.

## Conexión a MongoDB Atlas
1. Crear cuenta en https://www.mongodb.com/cloud/atlas
2. Crear cluster gratuito (M0)
3. Configurar usuario y contraseña
4. Agregar IP a whitelist (0.0.0.0/0 para desarrollo)
5. Obtener URI de conexión y pegar en `.env`
