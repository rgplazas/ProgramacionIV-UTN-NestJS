import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductosService } from './productos.service';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';
import { multerConfig } from '../cloudinary/multer.config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { RolUsuario } from '../users/schemas/usuario.schema';

@ApiTags('Productos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos los productos' })
  @ApiQuery({ name: 'categoria', required: false, description: 'Filtrar por categoria' })
  @ApiResponse({ status: 200, description: 'Lista de productos con imagenes' })
  findAll(@Query('categoria') categoria?: string) {
    return this.productosService.findAll(categoria);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(id);
  }

  @Roles(RolUsuario.ADMIN)
  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Crear un nuevo producto sin imagen (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Producto creado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  create(@Body() dto: CrearProductoDto) {
    return this.productosService.create(dto);
  }

  @Roles(RolUsuario.ADMIN)
  @Post(':id/imagen')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Subir o reemplazar la imagen de un producto (ADMIN)',
    description:
      'Sube la imagen a Cloudinary y guarda la URL publica en el producto. ' +
      'Si el producto ya tenia imagen, la anterior se elimina de Cloudinary automaticamente. ' +
      'Formatos aceptados: jpg, png, webp. Tamano maximo: 5 MB.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['imagen'],
      properties: {
        imagen: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (jpg, png, webp - max 5 MB)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagen subida. Producto actualizado con imagenUrl' })
  @ApiResponse({ status: 400, description: 'Archivo invalido (tipo o tamano incorrecto)' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @UseInterceptors(FileInterceptor('imagen', multerConfig))
  subirImagen(
    @Param('id') id: string,
    @UploadedFile() archivo: Express.Multer.File,
  ) {
    return this.productosService.subirImagen(id, archivo);
  }

  @Roles(RolUsuario.ADMIN)
  @Delete(':id/imagen')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Eliminar la imagen de un producto (ADMIN)',
    description: 'Elimina la imagen de Cloudinary y limpia los campos imagenUrl e imagenPublicId.',
  })
  @ApiResponse({ status: 200, description: 'Imagen eliminada de Cloudinary' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado o sin imagen asociada' })
  eliminarImagen(@Param('id') id: string) {
    return this.productosService.eliminarImagen(id);
  }

  @Roles(RolUsuario.ADMIN)
  @Put(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Actualizar datos del producto (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Producto actualizado' })
  update(@Param('id') id: string, @Body() dto: ActualizarProductoDto) {
    return this.productosService.update(id, dto);
  }

  @Roles(RolUsuario.ADMIN)
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Actualizacion parcial del producto (ADMIN)' })
  updateParcial(@Param('id') id: string, @Body() dto: ActualizarProductoDto) {
    return this.productosService.update(id, dto);
  }

  @Roles(RolUsuario.ADMIN)
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Eliminar un producto (ADMIN)',
    description: 'Soft delete. Si el producto tiene imagen, tambien se elimina de Cloudinary.',
  })
  @ApiResponse({ status: 200, description: 'Producto eliminado' })
  remove(@Param('id') id: string) {
    return this.productosService.softDelete(id);
  }
}
