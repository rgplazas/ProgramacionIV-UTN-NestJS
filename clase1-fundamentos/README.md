# Gestión de Inventario - Clase 1: Fundamentos de NestJS

## Descripción
API REST básica para gestión de productos utilizando NestJS con almacenamiento en memoria (array).
Este proyecto corresponde a la **Clase 1** de la Unidad 4 de Programación IV (TUP - UTN FR Avellaneda).

## Stack
- NestJS 11.x
- TypeScript 5.8+
- class-validator / class-transformer

## Instalación
```bash
npm install
```

## Ejecución
```bash
# Modo desarrollo (con hot-reload)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

## Endpoints
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /productos | Listar todos los productos |
| GET | /productos/:id | Obtener un producto por ID |
| POST | /productos | Crear un nuevo producto |
| PUT | /productos/:id | Actualizar un producto completo |
| PATCH | /productos/:id | Actualización parcial |
| DELETE | /productos/:id | Eliminar un producto |

## Ejemplos de uso (curl)
```bash
# Listar productos
curl http://localhost:3000/productos

# Crear producto
curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Laptop Dell XPS","descripcion":"Laptop 15 pulgadas","precio":1200,"stock":10,"categoria":"Electrónica"}'

# Obtener producto por ID
curl http://localhost:3000/productos/1

# Actualizar producto
curl -X PUT http://localhost:3000/productos/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Laptop Dell XPS 15","descripcion":"Actualizada","precio":1300,"stock":8,"categoria":"Electrónica"}'

# Eliminar producto
curl -X DELETE http://localhost:3000/productos/1
```

## Estructura del proyecto
```
src/
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
