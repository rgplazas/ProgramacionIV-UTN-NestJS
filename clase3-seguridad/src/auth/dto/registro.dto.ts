import { IsString, IsEmail, MinLength, IsOptional, IsEnum } from 'class-validator';
import { RolUsuario } from '../../users/schemas/usuario.schema';

export class RegistroDto {
  @IsString() @MinLength(2)
  nombre: string;

  @IsString() @MinLength(2)
  apellido: string;

  @IsEmail()
  email: string;

  @IsString() @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(RolUsuario)
  rol?: RolUsuario = RolUsuario.USER;
}
