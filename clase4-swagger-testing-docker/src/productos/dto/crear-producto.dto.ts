import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CrearProductoDto {
  @ApiProperty({ example: 'Laptop Dell XPS 15' })
  @IsString() nombre: string;

  @ApiProperty({ example: 'Laptop profesional', required: false })
  @IsString() @IsOptional() descripcion?: string;

  @ApiProperty({ example: 1899.99 })
  @IsNumber() @Min(0) precio: number;

  @ApiProperty({ example: 10 })
  @IsNumber() @Min(0) stock: number;

  @ApiProperty({ example: 'Electrónica' })
  @IsString() categoria: string;
}
