import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
export class CrearProductoDto {
  @IsString() nombre: string;
  @IsString() @IsOptional() descripcion?: string;
  @IsNumber() @Min(0) precio: number;
  @IsNumber() @Min(0) stock: number;
  @IsString() categoria: string;
}
