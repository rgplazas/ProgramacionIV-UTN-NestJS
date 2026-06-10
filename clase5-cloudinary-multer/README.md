# Gestion de Inventario - Clase 5: Subida de Imagenes con Multer y Cloudinary

## Descripcion

Este proyecto extiende la API desarrollada en la Clase 4 incorporando la capacidad de subir, reemplazar y eliminar imagenes de productos. Las imagenes se almacenan en **Cloudinary**, un servicio de gestion de medios en la nube, y se transfieren desde el cliente hasta el servidor mediante **Multer**, el middleware de Node.js para el manejo de datos `multipart/form-data`.

Este proyecto corresponde a la **Clase 5** de la Unidad 4 de Programacion IV (TUP - UTN FR Avellaneda).

---

## Que se aprende en esta clase

- Diferencia entre almacenamiento en disco y almacenamiento en la nube para archivos.
- Configuracion de Multer con `memoryStorage` para mantener el archivo en RAM antes de enviarlo a Cloudinary.
- Uso de `FileInterceptor` de `@nestjs/platform-express` para interceptar archivos en un endpoint.
- Validacion de tipo MIME y tamano maximo de archivo en la capa de Multer.
- Integracion del SDK de Cloudinary v2 con NestJS mediante un provider personalizado.
- Transformacion de imagenes en el momento de la subida (redimension, compresion y formato automatico).
- Ciclo completo de vida de una imagen: subir, reemplazar y eliminar desde Cloudinary.
- Documentacion de un endpoint `multipart/form-data` con Swagger (`@ApiConsumes`, `@ApiBody`).

---

## Stack tecnologico

| Paquete | Version | Rol |
|---|---|---|
| NestJS | 11.x | Framework principal |
| TypeScript | 5.8+ | Lenguaje |
| MongoDB + Mongoose | 8.x | Base de datos |
| @nestjs/passport + passport-jwt | 11.x / 4.x | Autenticacion JWT |
| multer | 1.4.5-lts | Manejo de archivos multipart |
| @types/multer | 1.4.x | Tipos TypeScript para Multer |
| cloudinary | 2.x | SDK oficial de Cloudinary |
| @nestjs/swagger | 11.x | Documentacion OpenAPI |
| helmet | 8.x | Headers de seguridad HTTP |
| @nestjs/throttler | 6.x | Rate limiting |

---

## Configuracion previa: cuenta de Cloudinary

1. Crear una cuenta gratuita en https://cloudinary.com
2. Ingresar al **Dashboard** de Cloudinary.
3. Copiar los tres valores que se necesitan:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
4. Pegarlos en el archivo `.env` (ver seccion siguiente).

La cuenta gratuita de Cloudinary incluye 25 GB de almacenamiento y 25 GB de transferencia mensual, suficiente para desarrollo y pruebas.

---

## Instalacion y ejecucion

```bash
cd clase5-cloudinary-multer
cp .env.example .env
# Editar .env y completar los valores de MongoDB y Cloudinary
npm install
npm run start:dev
```

Servidor disponible en `http://localhost:3000`.
Swagger UI disponible en `http://localhost:3000/api/docs`.

### Variables de entorno requeridas

```bash
# .env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gestion-inventario-c5

# JWT
JWT_SECRET=clave-aleatoria-larga-generada-con-openssl
JWT_EXPIRES_IN=1h

# Rate limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10

# Cloudinary (Dashboard → Account Details)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

Generar un `JWT_SECRET` seguro:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Con Docker Compose

```bash
# Asegurarse de que .env tenga los valores de Cloudinary y JWT_SECRET
docker-compose up --build

# Detener
docker-compose down
```

Docker Compose levanta la API NestJS y MongoDB en una red interna. Las credenciales de Cloudinary se toman del `.env` del host.

---

## Endpoints

### Autenticacion (publicos)

| Metodo | Endpoint | Descripcion |
|---|---|---|
| POST | /auth/registro | Registrar usuario (`nombre`, `apellido`, `email`, `password`, `rol`) |
| POST | /auth/login | Iniciar sesion. Devuelve `token` JWT |

### Autenticacion (requieren JWT)

| Metodo | Endpoint | Rol | Descripcion |
|---|---|---|---|
| GET | /auth/perfil | USER / ADMIN | Ver perfil propio |
| GET | /auth/admin | ADMIN | Prueba de restriccion por rol |

### Productos

| Metodo | Endpoint | Auth | Descripcion |
|---|---|---|---|
| GET | /productos | No | Listar productos (filtro por `?categoria=`) |
| GET | /productos/:id | No | Ver un producto |
| POST | /productos | ADMIN | Crear producto (JSON, sin imagen) |
| PUT | /productos/:id | ADMIN | Actualizar datos del producto |
| PATCH | /productos/:id | ADMIN | Actualizacion parcial |
| **POST** | **/productos/:id/imagen** | **ADMIN** | **Subir o reemplazar imagen (multipart/form-data)** |
| **DELETE** | **/productos/:id/imagen** | **ADMIN** | **Eliminar imagen de Cloudinary** |
| DELETE | /productos/:id | ADMIN | Soft delete (elimina imagen de Cloudinary si existe) |

---

## Flujo de subida de imagen

```
Cliente                    API NestJS                    Cloudinary
  |                            |                              |
  |-- POST /productos/:id/imagen (multipart/form-data) ------>|
  |   campo: imagen (archivo)  |                              |
  |                            |-- FileInterceptor            |
  |                            |   valida tipo y tamano       |
  |                            |-- multerConfig               |
  |                            |   (memoryStorage, 5 MB max)  |
  |                            |                              |
  |                            |-- CloudinaryService          |
  |                            |   upload_stream() ---------->|
  |                            |                              |-- almacena imagen
  |                            |                              |-- aplica transformacion
  |                            |<-- { secure_url, public_id } |
  |                            |                              |
  |                            |-- guarda en MongoDB          |
  |                            |   imagenUrl = secure_url     |
  |                            |   imagenPublicId = public_id |
  |<-- 200 { producto actualizado con imagenUrl } ------------|
```

---

## Ejemplo de uso con curl

```bash
# 1. Registrar usuario ADMIN
curl -X POST http://localhost:3000/auth/registro \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana","apellido":"Lopez","email":"ana@utn.edu.ar","password":"secreto123","rol":"ADMIN"}'

# 2. Login y guardar token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@utn.edu.ar","password":"secreto123"}' | node -e "process.stdin.resume();let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).token))")

# 3. Crear producto
curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"nombre":"Laptop Dell XPS","precio":1899.99,"stock":5,"categoria":"Electronica"}'

# 4. Subir imagen al producto (reemplazar ID_DEL_PRODUCTO con el _id devuelto en el paso anterior)
curl -X POST http://localhost:3000/productos/ID_DEL_PRODUCTO/imagen \
  -H "Authorization: Bearer $TOKEN" \
  -F "imagen=@/ruta/a/tu/imagen.jpg"

# 5. Verificar que imagenUrl fue guardada
curl http://localhost:3000/productos/ID_DEL_PRODUCTO

# 6. Eliminar imagen
curl -X DELETE http://localhost:3000/productos/ID_DEL_PRODUCTO/imagen \
  -H "Authorization: Bearer $TOKEN"
```

---

## Estructura del proyecto

```
clase5-cloudinary-multer/
├── src/
│   ├── cloudinary/
│   │   ├── cloudinary.config.ts   # Provider: configura v2 con credenciales del .env
│   │   ├── cloudinary.service.ts  # subirImagen() y eliminarImagen()
│   │   ├── cloudinary.module.ts   # Exporta CloudinaryService
│   │   └── multer.config.ts       # memoryStorage, fileFilter, limite 5 MB
│   ├── productos/
│   │   ├── dto/
│   │   │   ├── crear-producto.dto.ts
│   │   │   └── actualizar-producto.dto.ts
│   │   ├── schemas/
│   │   │   └── producto.schema.ts  # Agrega campos imagenUrl e imagenPublicId
│   │   ├── productos.controller.ts # Incluye POST /:id/imagen y DELETE /:id/imagen
│   │   ├── productos.service.ts    # Llama a CloudinaryService en subida y eliminacion
│   │   └── productos.module.ts
│   ├── auth/
│   │   ├── decorators/
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/
│   │   ├── schemas/
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── app.module.ts
│   └── main.ts
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── nest-cli.json
├── tsconfig.json
└── package.json
```

---

## Conceptos clave

### memoryStorage vs diskStorage

Multer ofrece dos estrategias de almacenamiento:

- **`diskStorage`**: guarda el archivo en el disco del servidor antes de procesarlo. No es adecuado para entornos con multiples instancias o plataformas serverless.
- **`memoryStorage`**: mantiene el archivo en un `Buffer` en RAM. Es la opcion correcta cuando el destino final es un servicio externo como Cloudinary, ya que el archivo se envia directamente sin tocar el disco.

Este proyecto utiliza `memoryStorage`.

### Transformaciones en Cloudinary

Al subir una imagen, se aplican las siguientes transformaciones de forma automatica:

| Parametro | Valor | Efecto |
|---|---|---|
| `width` / `height` | 800 x 800 | Limita el tamano maximo |
| `crop` | `limit` | No recorta, solo reduce si supera el limite |
| `quality` | `auto:good` | Compresion automatica con buena calidad |
| `fetch_format` | `auto` | Sirve WebP a navegadores compatibles, JPEG al resto |

### public_id de Cloudinary

Cada imagen subida recibe un `public_id` unico en Cloudinary (ej: `productos/abc123`). Este identificador se guarda en el campo `imagenPublicId` del documento de MongoDB y se usa para:

- Reemplazar la imagen anterior al subir una nueva (se elimina antes de subir).
- Eliminar la imagen cuando se borra el producto.

---

## Notas para el alumno

- El campo `imagen` en el `FormData` debe coincidir exactamente con el nombre pasado a `FileInterceptor('imagen', ...)`. Si se usa un nombre distinto, el archivo no sera interceptado.
- Al probar en Swagger UI, usar el boton "Choose File" que aparece en el endpoint `POST /productos/:id/imagen` gracias a `@ApiConsumes('multipart/form-data')`.
- Si se sube una imagen a un producto que ya tiene una, la imagen anterior se elimina de Cloudinary automaticamente antes de subir la nueva.
- Las credenciales de Cloudinary (`API_SECRET`) son privadas. Nunca deben exponerse en el frontend ni en el repositorio.

---

*UTN FR Avellaneda - Programacion IV - Tecnicatura Universitaria en Programacion*
