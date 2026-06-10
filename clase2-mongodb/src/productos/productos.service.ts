import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Producto, ProductoDocument } from './schemas/producto.schema';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';
import { ListarProductosDto } from './dto/listar-productos.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectModel(Producto.name) private productoModel: Model<ProductoDocument>,
  ) {}

  async findAll(query: ListarProductosDto) {
    const { pagina = 1, limite = 10, categoria, busqueda, ordenarPor = 'createdAt', orden = 'desc' } = query;

    const filtro: any = { eliminado: false };
    if (categoria) filtro.categoria = categoria;
    if (busqueda) {
      filtro.$or = [
        { nombre: { $regex: busqueda, $options: 'i' } },
        { descripcion: { $regex: busqueda, $options: 'i' } },
      ];
    }

    const skip = (pagina - 1) * limite;
    const sortOrder = orden === 'asc' ? 1 : -1;

    const [datos, total] = await Promise.all([
      this.productoModel
        .find(filtro)
        .sort({ [ordenarPor]: sortOrder })
        .skip(skip)
        .limit(limite)
        .exec(),
      this.productoModel.countDocuments(filtro).exec(),
    ]);

    return {
      datos,
      meta: {
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
        tieneSiguiente: pagina * limite < total,
        tieneAnterior: pagina > 1,
      },
    };
  }

  async findOne(id: string): Promise<Producto> {
    const producto = await this.productoModel.findOne({ _id: id, eliminado: false }).exec();
    if (!producto) throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    return producto;
  }

  async create(dto: CrearProductoDto): Promise<Producto> {
    const nuevo = new this.productoModel(dto);
    return nuevo.save();
  }

  async update(id: string, dto: ActualizarProductoDto): Promise<Producto> {
    const producto = await this.productoModel
      .findOneAndUpdate({ _id: id, eliminado: false }, dto, { new: true })
      .exec();
    if (!producto) throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    return producto;
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.productoModel
      .findOneAndUpdate({ _id: id, eliminado: false }, { eliminado: true })
      .exec();
    if (!result) throw new NotFoundException(`Producto con ID ${id} no encontrado`);
  }

  async buscar(q: string): Promise<Producto[]> {
    return this.productoModel
      .find({
        eliminado: false,
        $or: [
          { nombre: { $regex: q, $options: 'i' } },
          { descripcion: { $regex: q, $options: 'i' } },
        ],
      })
      .limit(20)
      .exec();
  }
}
