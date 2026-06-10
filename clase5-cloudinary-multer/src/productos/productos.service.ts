import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Producto, ProductoDocument } from './schemas/producto.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectModel(Producto.name) private model: Model<ProductoDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(categoria?: string) {
    const filtro: any = { eliminado: false };
    if (categoria) filtro.categoria = new RegExp(categoria, 'i');
    return this.model.find(filtro).select('-eliminado').exec();
  }

  async findOne(id: string) {
    const producto = await this.model
      .findOne({ _id: id, eliminado: false })
      .select('-eliminado')
      .exec();
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  async create(dto: CrearProductoDto) {
    return new this.model(dto).save();
  }

  async subirImagen(id: string, archivo: Express.Multer.File) {
    const producto = await this.findOne(id);

    if (producto.imagenPublicId) {
      await this.cloudinaryService.eliminarImagen(producto.imagenPublicId);
    }

    const resultado = await this.cloudinaryService.subirImagen(
      archivo,
      'productos',
    );

    const actualizado = await this.model
      .findByIdAndUpdate(
        id,
        {
          imagenUrl: resultado.secure_url,
          imagenPublicId: resultado.public_id,
        },
        { new: true },
      )
      .exec();

    return actualizado;
  }

  async eliminarImagen(id: string) {
    const producto = await this.findOne(id);

    if (!producto.imagenPublicId) {
      throw new NotFoundException('El producto no tiene imagen asociada');
    }

    await this.cloudinaryService.eliminarImagen(producto.imagenPublicId);

    const actualizado = await this.model
      .findByIdAndUpdate(
        id,
        { imagenUrl: null, imagenPublicId: null },
        { new: true },
      )
      .exec();

    return actualizado;
  }

  async update(id: string, dto: ActualizarProductoDto) {
    const producto = await this.model
      .findOneAndUpdate({ _id: id, eliminado: false }, dto, { new: true })
      .exec();
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  async softDelete(id: string) {
    const producto = await this.findOne(id);

    if (producto.imagenPublicId) {
      await this.cloudinaryService.eliminarImagen(producto.imagenPublicId);
    }

    await this.model
      .findByIdAndUpdate(id, {
        eliminado: true,
        imagenUrl: null,
        imagenPublicId: null,
      })
      .exec();
  }
}
