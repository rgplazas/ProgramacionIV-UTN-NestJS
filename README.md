# Programacion IV - UTN FR Avellaneda
## Proyecto Integrador: API REST con NestJS

**Tecnicatura Universitaria en Programacion (TUP)**
Unidad 4 - Desarrollo de APIs con Node.js y NestJS

---

## Descripcion general

Este repositorio contiene el proyecto integrador de la Unidad 4, desarrollado de forma incremental a lo largo de cuatro clases. El dominio de trabajo es un sistema de gestion de inventario de productos, que evoluciona desde una API minima hasta una aplicacion lista para produccion.

Cada clase agrega una capa de complejidad sobre la anterior, de modo que el alumno puede comparar versiones y comprender con claridad que aporta cada tecnologia o patron incorporado.

---

## Estructura del repositorio

```
ProgramacionIV-UTN-NestJS/
├── clase1-fundamentos/            # API basica, almacenamiento en memoria
├── clase2-mongodb/                # Persistencia con MongoDB y Mongoose
├── clase3-seguridad/              # Autenticacion JWT y autorizacion por roles
└── clase4-swagger-testing-docker/ # Documentacion, testing y contenedores
```

Cada directorio es un proyecto NestJS independiente con su propio `package.json`. No existe dependencia de instalacion entre ellos.

---

## Evolucion del proyecto integrador

```
Clase 1: API basica con array en memoria
         CRUD completo, validaciones con class-validator
    |
    v
Clase 2: + MongoDB + Mongoose
         Persistencia real, paginacion, soft delete, seed de datos
    |
    v
Clase 3: + Autenticacion JWT
         Registro, login, guards de rutas, roles ADMIN / USER,
         rate limiting, headers de seguridad (Helmet)
    |
    v
Clase 4: + Swagger/OpenAPI + Jest + Docker
         Documentacion interactiva, tests unitarios y E2E,
         imagen multi-stage, Docker Compose, despliegue en la nube
```

---

## Requisitos previos

| Herramienta | Version minima | Uso |
|---|---|---|
| Node.js | 20 LTS o superior | Runtime de JavaScript |
| npm | 10.x | Gestion de dependencias |
| NestJS CLI | 11.x | Scaffolding y compilacion |
| MongoDB | 7.x (Atlas o local) | Base de datos (clases 2, 3 y 4) |
| Docker Desktop | 24.x | Contenedores (clase 4) |

Verificar instalacion:

```bash
node --version
npm --version
npx @nestjs/cli --version
docker --version
```

---

## Como ejecutar cada proyecto

### Proyecto 1 - Fundamentos (Clase 1)

API REST con almacenamiento en memoria (array). No requiere base de datos ni archivo `.env`.

```bash
cd clase1-fundamentos
npm install
npm run start:dev
```

La API queda disponible en `http://localhost:3000/productos`.

Variables de entorno disponibles (opcionales):

```bash
# .env.example
PORT=3000
NODE_ENV=development
DEFAULT_PAGE_SIZE=10
MAX_PAGE_SIZE=100
```

---

### Proyecto 2 - MongoDB (Clase 2)

Reemplaza el array en memoria por una base de datos MongoDB real. Requiere configurar la URI de conexion antes de iniciar.

```bash
cd clase2-mongodb
cp .env.example .env
# Editar .env y completar MONGODB_URI con el string de conexion
npm install
npm run start:dev
```

Cargar datos de prueba (10 productos de ejemplo):

```bash
npm run seed
```

Variables de entorno requeridas:

```bash
# .env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://usuario:contrasena@cluster.mongodb.net/gestion-inventario
DEFAULT_PAGE_SIZE=10
MAX_PAGE_SIZE=100
```

Para usar MongoDB en local en lugar de Atlas:

```bash
MONGODB_URI=mongodb://localhost:27017/gestion-inventario
```

---

### Proyecto 3 - Seguridad JWT (Clase 3)

Incorpora autenticacion y autorizacion. El JWT_SECRET debe ser una cadena larga y aleatoria; nunca usar el valor de ejemplo en produccion.

```bash
cd clase3-seguridad
cp .env.example .env
# Editar .env: completar MONGODB_URI y JWT_SECRET
npm install
npm run start:dev
```

Generar un JWT_SECRET seguro:

```bash
# En Linux / macOS
openssl rand -base64 32

# Alternativa con Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Variables de entorno requeridas:

```bash
# .env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gestion-inventario
JWT_SECRET=clave-aleatoria-larga-generada-con-openssl
JWT_EXPIRES_IN=1h
THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

Flujo de autenticacion:

```bash
# 1. Registrar un usuario
POST /auth/registro
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Perez",
  "email": "juan@utn.edu.ar",
  "password": "secreto123",
  "rol": "ADMIN"
}

# 2. Iniciar sesion y obtener token
POST /auth/login
Content-Type: application/json

{
  "email": "juan@utn.edu.ar",
  "password": "secreto123"
}
# Respuesta: { "access_token": "eyJhbGci..." }

# 3. Usar el token en las peticiones protegidas
Authorization: Bearer eyJhbGci...
```

---

### Proyecto 4 - Swagger + Testing + Docker (Clase 4)

Proyecto final. Incluye documentacion Swagger, tests con Jest y contenedores Docker.

**Desarrollo local:**

```bash
cd clase4-swagger-testing-docker
cp .env.example .env
# Editar .env con MONGODB_URI y JWT_SECRET
npm install
npm run start:dev
```

Interfaz Swagger disponible en `http://localhost:3000/api/docs`.
Esquema OpenAPI en JSON: `http://localhost:3000/api/docs-json`.

**Ejecutar los tests:**

```bash
# Tests unitarios
npm test

# Tests unitarios con reporte de cobertura
npm run test:cov

# Tests end-to-end
npm run test:e2e
```

**Levantar con Docker Compose (MongoDB incluido):**

```bash
# Construir imagen y levantar todos los servicios
docker-compose up --build

# Solo levantar MongoDB (para desarrollo local con Node)
docker-compose up mongo

# Detener y eliminar contenedores
docker-compose down

# Detener y eliminar contenedores + volumen de datos
docker-compose down -v
```

Variables de entorno requeridas:

```bash
# .env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gestion-inventario
JWT_SECRET=clave-aleatoria-larga-generada-con-openssl
JWT_EXPIRES_IN=1h
THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

---

## Referencia de endpoints por proyecto

### Clase 1 y Clase 2 - Productos

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| GET | /productos | Listar productos (con paginacion en clase 2) | No |
| GET | /productos/:id | Obtener un producto por ID | No |
| GET | /productos/buscar?q=xxx | Buscar por nombre (clase 2) | No |
| POST | /productos | Crear producto | No |
| PUT | /productos/:id | Reemplazar producto completo | No |
| PATCH | /productos/:id | Actualizar campos parcialmente | No |
| DELETE | /productos/:id | Eliminar producto | No |

### Clase 3 y Clase 4 - Autenticacion y Productos protegidos

**Endpoints publicos:**

| Metodo | Endpoint | Descripcion |
|---|---|---|
| POST | /auth/registro | Registrar nuevo usuario |
| POST | /auth/login | Iniciar sesion, devuelve JWT |
| GET | /productos | Listar productos |
| GET | /productos/:id | Ver un producto |

**Endpoints protegidos (requieren JWT en el header):**

| Metodo | Endpoint | Rol requerido |
|---|---|---|
| POST | /productos | ADMIN |
| PUT | /productos/:id | ADMIN |
| PATCH | /productos/:id | ADMIN |
| DELETE | /productos/:id | ADMIN |
| GET | /auth/perfil | USER o ADMIN |
| GET | /auth/admin | ADMIN |

---

## Estructura de cada proyecto

### Clase 1

```
clase1-fundamentos/src/
├── productos/
│   ├── dto/
│   │   ├── crear-producto.dto.ts
│   │   └── actualizar-producto.dto.ts
│   ├── productos.controller.ts
│   ├── productos.service.ts
│   └── productos.module.ts
├── common/
│   └── filters/
│       └── http-exception.filter.ts
├── app.module.ts
└── main.ts
```

### Clase 2

```
clase2-mongodb/src/
├── productos/
│   ├── dto/
│   ├── schemas/
│   │   └── producto.schema.ts
│   ├── productos.controller.ts
│   ├── productos.service.ts
│   └── productos.module.ts
├── seed/
│   └── seed.ts
├── app.module.ts
└── main.ts
```

### Clase 3

```
clase3-seguridad/src/
├── auth/
│   ├── decorators/
│   ├── dto/
│   ├── guards/
│   ├── strategies/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/
├── productos/
├── app.module.ts
└── main.ts
```

### Clase 4

```
clase4-swagger-testing-docker/
├── src/
│   ├── auth/          # Autenticacion JWT con decoradores Swagger
│   ├── productos/     # CRUD con documentacion OpenAPI
│   ├── users/
│   ├── app.module.ts
│   └── main.ts        # Configuracion Swagger y middlewares
├── test/
│   ├── productos.e2e-spec.ts
│   ├── auth.e2e-spec.ts
│   └── jest-e2e.json
├── Dockerfile         # Multi-stage: build + produccion
└── docker-compose.yml # App + MongoDB
```

---

## Conceptos clave por clase

### Clase 1 - Fundamentos de NestJS

- **Modulos, Controladores y Servicios**: arquitectura en capas de NestJS.
- **DTOs con class-validator**: validacion declarativa de datos de entrada.
- **Pipes globales**: `ValidationPipe` con `whitelist` y `transform`.
- **Filtros de excepcion**: manejo centralizado de errores HTTP.
- **Inyeccion de dependencias**: patron IoC nativo de NestJS.

### Clase 2 - Persistencia con MongoDB

- **Mongoose**: ODM para modelar documentos con esquemas y tipos.
- **@nestjs/mongoose**: integracion del modulo con el sistema de IoC.
- **Soft delete**: los registros se marcan como eliminados, no se borran fisicamente.
- **Paginacion**: respuestas con `data`, `total`, `page` y `limit`.
- **Variables de entorno**: gestion con `@nestjs/config` y `ConfigService`.

### Clase 3 - Seguridad con JWT

- **Passport**: middleware de autenticacion con estrategias intercambiables.
- **Estrategia JWT**: extrae y valida el token en cada peticion protegida.
- **Guards**: `JwtAuthGuard` y `RolesGuard` controlan acceso a rutas.
- **Decoradores personalizados**: `@Roles()` y `@CurrentUser()`.
- **bcryptjs**: hashing de contrasenas con salt rounds configurable.
- **Rate limiting**: `@nestjs/throttler` limita peticiones por IP para prevenir ataques de fuerza bruta.
- **Helmet**: configura headers HTTP de seguridad (CSP, X-Frame-Options, etc.).

### Clase 4 - Calidad y Despliegue

- **Swagger/OpenAPI**: documentacion autogenerada con `@nestjs/swagger`.
- **Testing unitario con Jest**: pruebas de servicios con mocks e inyeccion de dependencias.
- **Testing E2E con Supertest**: pruebas de integracion sobre la aplicacion completa.
- **mongodb-memory-server**: instancia MongoDB en memoria para tests, sin dependencias externas.
- **Docker multi-stage**: la imagen de produccion no contiene fuentes TypeScript ni dependencias de desarrollo.
- **Docker Compose**: orquesta la API y MongoDB en una red interna.

---

## Despliegue en produccion

### Render (gratuito)

1. Crear cuenta en https://render.com
2. Crear un nuevo **Web Service** y conectar el repositorio de GitHub.
3. Configurar:
   - **Root Directory**: `clase4-swagger-testing-docker`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
4. Agregar las variables de entorno en el panel de Render.
5. Cada `git push` a la rama principal dispara un nuevo despliegue automatico.

### Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway add --database mongodb
railway up
```

---

## Notas para el alumno

- Cada proyecto puede ejecutarse de forma independiente; no es necesario instalar los demas.
- Los archivos `.env` no se suben al repositorio (estan en `.gitignore`). Siempre copiar `.env.example` a `.env` y completar los valores reales antes de ejecutar.
- El JWT_SECRET en produccion debe ser una cadena aleatoria de al menos 32 bytes. Nunca usar el valor del archivo `.env.example`.
- Para los tests de la Clase 4, `mongodb-memory-server` descarga automaticamente un binario de MongoDB la primera vez que se ejecutan. Esto puede tardar algunos minutos dependiendo de la conexion.
- El `docker-compose.yml` de la Clase 4 levanta MongoDB en el puerto 27017 del host. Si ya existe una instancia local de MongoDB corriendo en ese puerto, se producira un conflicto. Detener el servicio local antes de ejecutar Docker Compose.

---

## Tecnologias utilizadas en el proyecto

| Tecnologia | Version | Rol |
|---|---|---|
| NestJS | 11.x | Framework principal |
| TypeScript | 5.8+ | Lenguaje de programacion |
| MongoDB | 8.x | Base de datos documental |
| Mongoose | 8.x | ODM para MongoDB |
| Passport + passport-jwt | 0.7 / 4.x | Autenticacion |
| @nestjs/jwt | 11.x | Generacion y validacion de tokens JWT |
| bcryptjs | 2.4.x | Hashing de contrasenas |
| @nestjs/throttler | 6.x | Rate limiting |
| Helmet | 8.x | Headers de seguridad HTTP |
| @nestjs/swagger | 11.x | Generacion de documentacion OpenAPI |
| Jest | 29.x | Framework de testing |
| Supertest | 7.x | Testing de peticiones HTTP |
| mongodb-memory-server | 10.x | MongoDB en memoria para tests |
| Docker / Docker Compose | 24.x | Contenedores y orquestacion |
| class-validator | 0.14.x | Validacion declarativa de DTOs |
| class-transformer | 0.5.x | Transformacion de objetos plain a clases |

---

*UTN FR Avellaneda - Programacion IV - Tecnicatura Universitaria en Programacion*
