import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductoDocument = HydratedDocument<Producto>;

@Schema({ timestamps: true })
export class Producto {
  @Prop({ required: true, minlength: 3, maxlength: 100 })
  nombre: string;

  @Prop({ maxlength: 500 })
  descripcion: string;

  @Prop({ required: true, min: 0 })
  precio: number;

  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  @Prop({ required: true })
  categoria: string;

  @Prop({ default: false })
  eliminado: boolean;
}

export const ProductoSchema = SchemaFactory.createForClass(Producto);

// Índices para búsquedas frecuentes
ProductoSchema.index({ nombre: 'text', descripcion: 'text' });
ProductoSchema.index({ categoria: 1 });
ProductoSchema.index({ precio: 1 });
