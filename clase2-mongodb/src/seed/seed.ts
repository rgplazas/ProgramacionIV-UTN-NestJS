import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductosService } from '../productos/productos.service';

const productosSeed = [
  { nombre: 'Laptop Dell XPS 15', descripcion: 'Laptop profesional 15.6 pulgadas, Intel Core i7, 16GB RAM, 512GB SSD', precio: 1899.99, stock: 15, categoria: 'Electrónica' },
  { nombre: 'Monitor Samsung 27"', descripcion: 'Monitor curvo QHD 2560x1440, 144Hz, 1ms', precio: 549.99, stock: 25, categoria: 'Electrónica' },
  { nombre: 'Teclado Mecánico Keychron K8', descripcion: 'Teclado mecánico inalámbrico, switches Brown, retroiluminación RGB', precio: 129.99, stock: 40, categoria: 'Periféricos' },
  { nombre: 'Mouse Logitech MX Master 3S', descripcion: 'Mouse inalámbrico ergonómico, sensor 8000 DPI, multi-dispositivo', precio: 119.99, stock: 50, categoria: 'Periféricos' },
  { nombre: 'Silla Ergonómica ErgoChair Pro', descripcion: 'Silla de oficina ergonómica, reclinación completa, ajustable', precio: 499.99, stock: 10, categoria: 'Mobiliario' },
  { nombre: 'Escritorio Eléctrico FlexiSpot', descripcion: 'Escritorio de pie eléctrico, ajustable 71-121cm, tablero 140x70cm', precio: 399.99, stock: 8, categoria: 'Mobiliario' },
  { nombre: 'Webcam Logitech C920 HD', descripcion: 'Webcam Full HD 1080p, autofocus, micrófonos duales', precio: 89.99, stock: 60, categoria: 'Periféricos' },
  { nombre: 'Auriculares Sony WH-1000XM5', descripcion: 'Auriculares con cancelación de ruido, 30h de batería', precio: 379.99, stock: 20, categoria: 'Electrónica' },
  { nombre: 'Disco SSD Externo Samsung T7', descripcion: 'SSD portátil 1TB, USB-C, velocidad hasta 1050MB/s', precio: 149.99, stock: 35, categoria: 'Almacenamiento' },
  { nombre: 'Router WiFi 6 ASUS AX5400', descripcion: 'Router gaming WiFi 6, doble banda, 5400Mbps', precio: 229.99, stock: 12, categoria: 'Redes' },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productosService = app.get(ProductosService);

  console.log('Cargando datos de seed...');
  for (const producto of productosSeed) {
    try {
      await productosService.create(producto);
      console.log(`  Creado: ${producto.nombre}`);
    } catch (e) {
      console.log(`  Error con ${producto.nombre}: ${e.message}`);
    }
  }
  console.log('Seed completado.');
  await app.close();
}
bootstrap();
