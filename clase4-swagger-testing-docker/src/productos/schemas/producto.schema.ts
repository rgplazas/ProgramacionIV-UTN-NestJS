import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProductoDocument = HydratedDocument<Producto>;

@Schema({ timestamps: true })
export class Producto {
  @ApiProperty()
  _id: string;

  @ApiProperty({ example: 'Laptop Dell XPS' })
  @Prop({ required: true }) nombre: string;

  @ApiProperty({ example: 'Laptop 15 pulgadas' })
  @Prop() descripcion: string;

  @ApiProperty({ example: 1899.99 })
  @Prop({ required: true, min: 0 }) precio: number;

  @ApiProperty({ example: 10 })
  @Prop({ required: true, min: 0, default: 0 }) stock: number;

  @ApiProperty({ example: 'Electrónica' })
  @Prop({ required: true }) categoria: string;

  @Prop({ default: false }) eliminado: boolean;
}

export const ProductoSchema = SchemaFactory.createForClass(Producto);
