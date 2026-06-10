import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'juan@utn.edu.ar' })
  @IsEmail() email: string;

  @ApiProperty({ example: 'secreto123' })
  @IsString() @MinLength(6) password: string;
}
