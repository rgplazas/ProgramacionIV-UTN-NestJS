import { IsOptional, IsNumber, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ListarProductosDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pagina?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limite?: number = 10;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsString()
  busqueda?: string;

  @IsOptional()
  @IsString()
  ordenarPor?: string = 'createdAt';

  @IsOptional()
  @IsString()
  orden?: 'asc' | 'desc' = 'desc';
}
