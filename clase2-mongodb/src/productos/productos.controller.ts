import {
  Controller, Get, Post, Put, Patch, Delete,
  Body, Param, Query, HttpCode, HttpStatus
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';
import { ListarProductosDto } from './dto/listar-productos.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  findAll(@Query() query: ListarProductosDto) {
    return this.productosService.findAll(query);
  }

  @Get('buscar')
  buscar(@Query('q') q: string) {
    return this.productosService.buscar(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CrearProductoDto) {
    return this.productosService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: ActualizarProductoDto) {
    return this.productosService.update(id, dto);
  }

  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() dto: ActualizarProductoDto) {
    return this.productosService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.productosService.softDelete(id);
  }
}
