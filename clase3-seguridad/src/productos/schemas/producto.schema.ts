import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type ProductoDocument = HydratedDocument<Producto>;
@Schema({ timestamps: true })
export class Producto {
  @Prop({ required: true }) nombre: string;
  @Prop() descripcion: string;
  @Prop({ required: true, min: 0 }) precio: number;
  @Prop({ required: true, min: 0, default: 0 }) stock: number;
  @Prop({ required: true }) categoria: string;
  @Prop({ default: false }) eliminado: boolean;
}
export const ProductoSchema = SchemaFactory.createForClass(Producto);
