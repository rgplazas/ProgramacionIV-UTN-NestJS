import { IsString, IsNumber, IsOptional, Min, MinLength, MaxLength } from 'class-validator';

export class CrearProductoDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  descripcion?: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsString()
  @MinLength(2)
  categoria: string;
}
