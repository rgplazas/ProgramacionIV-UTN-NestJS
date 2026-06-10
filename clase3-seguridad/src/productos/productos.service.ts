import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Producto, ProductoDocument } from './schemas/producto.schema';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';

@Injectable()
export class ProductosService {
  constructor(@InjectModel(Producto.name) private model: Model<ProductoDocument>) {}

  async findAll() { return this.model.find({ eliminado: false }).exec(); }
  async findOne(id: string) {
    const p = await this.model.findOne({ _id: id, eliminado: false }).exec();
    if (!p) throw new NotFoundException('Producto no encontrado');
    return p;
  }
  async create(dto: CrearProductoDto) { return new this.model(dto).save(); }
  async update(id: string, dto: ActualizarProductoDto) {
    const p = await this.model.findOneAndUpdate({ _id: id, eliminado: false }, dto, { new: true }).exec();
    if (!p) throw new NotFoundException('Producto no encontrado');
    return p;
  }
  async softDelete(id: string) {
    const p = await this.model.findOneAndUpdate({ _id: id, eliminado: false }, { eliminado: true }).exec();
    if (!p) throw new NotFoundException('Producto no encontrado');
  }
}
