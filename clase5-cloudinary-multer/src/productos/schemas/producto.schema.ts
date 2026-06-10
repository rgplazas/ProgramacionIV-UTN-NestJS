import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProductoDocument = HydratedDocument<Producto>;

@Schema({ timestamps: true })
export class Producto {
  @ApiProperty({ example: 'Laptop Dell XPS' })
  @Prop({ required: true, minlength: 3, maxlength: 100 })
  nombre: string;

  @ApiProperty({ example: 'Laptop 15 pulgadas con pantalla OLED' })
  @Prop({ maxlength: 500 })
  descripcion: string;

  @ApiProperty({ example: 1899.99 })
  @Prop({ required: true, min: 0 })
  precio: number;

  @ApiProperty({ example: 10 })
  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  @ApiProperty({ example: 'Electronica' })
  @Prop({ required: true })
  categoria: string;

  @ApiProperty({
    example: 'https://res.cloudinary.com/demo/image/upload/v1/productos/laptop.jpg',
    description: 'URL publica de la imagen almacenada en Cloudinary',
    required: false,
  })
  @Prop({ default: null })
  imagenUrl: string;

  @ApiProperty({
    example: 'productos/abc123xyz',
    description: 'Public ID de Cloudinary, necesario para eliminar la imagen',
    required: false,
  })
  @Prop({ default: null })
  imagenPublicId: string;

  @Prop({ default: false })
  eliminado: boolean;
}

export const ProductoSchema = SchemaFactory.createForClass(Producto);

ProductoSchema.index({ nombre: 'text', descripcion: 'text' });
ProductoSchema.index({ categoria: 1 });
ProductoSchema.index({ precio: 1 });
