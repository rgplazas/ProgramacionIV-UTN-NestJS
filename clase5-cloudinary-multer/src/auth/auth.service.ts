import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async registro(dto: RegistroDto) {
    const existente = await this.usersService.findByEmail(dto.email);
    if (existente) throw new ConflictException('El email ya esta registrado');

    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(dto.password, salt);

    const usuario = await this.usersService.create({
      nombre: dto.nombre, apellido: dto.apellido,
      email: dto.email, password: passwordHasheada, rol: dto.rol,
    });

    const token = this.jwtService.sign({
      sub: usuario._id.toString(),
      email: usuario.email,
      rol: usuario.rol,
    });
    return { token, usuario: this.sanitizar(usuario) };
  }

  async login(dto: LoginDto) {
    const usuario = await this.usersService.findByEmail(dto.email);
    if (!usuario) throw new UnauthorizedException('Credenciales invalidas');

    const valida = await bcrypt.compare(dto.password, usuario.password);
    if (!valida) throw new UnauthorizedException('Credenciales invalidas');

    const token = this.jwtService.sign({
      sub: usuario._id.toString(),
      email: usuario.email,
      rol: usuario.rol,
    });
    return { token, usuario: this.sanitizar(usuario) };
  }

  async perfil(userId: string) {
    const usuario = await this.usersService.findById(userId);
    if (!usuario) throw new UnauthorizedException('Usuario no encontrado');
    return this.sanitizar(usuario);
  }

  private sanitizar(u: any) {
    const obj = u.toObject ? u.toObject() : u;
    const { password, ...resto } = obj;
    return resto;
  }
}
