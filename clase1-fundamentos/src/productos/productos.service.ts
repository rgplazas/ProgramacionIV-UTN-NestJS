import { Injectable, NotFoundException } from '@nestjs/common';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';
import { Producto } from './producto.interface';

@Injectable()
export class ProductosService {
  private productos: Producto[] = [];
  private nextId = 1;

  findAll(): Producto[] {
    return [...this.productos];
  }

  findOne(id: number): Producto {
    const producto = this.productos.find(p => p.id === id);
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  create(dto: CrearProductoDto): Producto {
    const producto: Producto = {
      id: this.nextId++,
      ...dto,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
    this.productos.push(producto);
    return producto;
  }

  update(id: number, dto: ActualizarProductoDto): Producto {
    const index = this.productos.findIndex(p => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    this.productos[index] = {
      ...this.productos[index],
      ...dto,
      id, // preservar ID original
      fechaActualizacion: new Date(),
    };
    return this.productos[index];
  }

  partialUpdate(id: number, dto: ActualizarProductoDto): Producto {
    return this.update(id, dto);
  }

  remove(id: number): void {
    const index = this.productos.findIndex(p => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    this.productos.splice(index, 1);
  }
}
