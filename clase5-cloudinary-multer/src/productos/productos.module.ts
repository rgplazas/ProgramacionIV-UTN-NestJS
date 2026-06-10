import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Producto, ProductoSchema } from './schemas/producto.schema';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Producto.name, schema: ProductoSchema }]),
    CloudinaryModule,
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
