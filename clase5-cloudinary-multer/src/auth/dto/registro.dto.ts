import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsOptional, IsEnum } from 'class-validator';
import { RolUsuario } from '../../users/schemas/usuario.schema';

export class RegistroDto {
  @ApiProperty({ example: 'Juan', description: 'Nombre del usuario' })
  @IsString() @MinLength(2) nombre: string;

  @ApiProperty({ example: 'Perez', description: 'Apellido del usuario' })
  @IsString() @MinLength(2) apellido: string;

  @ApiProperty({ example: 'juan@utn.edu.ar', description: 'Correo electronico' })
  @IsEmail() email: string;

  @ApiProperty({ example: 'secreto123', description: 'Contrasena (minimo 6 caracteres)' })
  @IsString() @MinLength(6) password: string;

  @ApiProperty({ enum: RolUsuario, required: false, description: 'Rol del usuario' })
  @IsOptional() @IsEnum(RolUsuario) rol?: RolUsuario = RolUsuario.USER;
}
