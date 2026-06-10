import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsInt, Min, MinLength, MaxLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearProductoDto {
  @ApiProperty({ example: 'Laptop Dell XPS', description: 'Nombre del producto (3-100 caracteres)' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 'Laptop 15 pulgadas con pantalla OLED', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @ApiProperty({ example: 1899.99, description: 'Precio en pesos (debe ser mayor a 0)' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  precio: number;

  @ApiProperty({ example: 10, description: 'Cantidad en stock (0 o mas)' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'Electronica', description: 'Categoria del producto' })
  @IsString()
  @MinLength(2)
  categoria: string;
}
