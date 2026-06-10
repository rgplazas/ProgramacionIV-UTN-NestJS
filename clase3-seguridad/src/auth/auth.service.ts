import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registro(dto: RegistroDto) {
    const existente = await this.usersService.findByEmail(dto.email);
    if (existente) {
      throw new ConflictException('El email ya está registrado');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(dto.password, salt);

    const usuario = await this.usersService.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email,
      password: passwordHasheada,
      rol: dto.rol,
    });

    const token = this.generarToken(usuario._id.toString(), usuario.email, usuario.rol);
    return { token, usuario: this.sanitizarUsuario(usuario) };
  }

  async login(dto: LoginDto) {
    const usuario = await this.usersService.findByEmail(dto.email);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValida = await bcrypt.compare(dto.password, usuario.password);
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.generarToken(usuario._id.toString(), usuario.email, usuario.rol);
    return { token, usuario: this.sanitizarUsuario(usuario) };
  }

  async perfil(userId: string) {
    const usuario = await this.usersService.findById(userId);
    if (!usuario) throw new UnauthorizedException('Usuario no encontrado');
    return this.sanitizarUsuario(usuario);
  }

  private generarToken(userId: string, email: string, rol: string): string {
    return this.jwtService.sign({ sub: userId, email, rol });
  }

  private sanitizarUsuario(usuario: any) {
    const obj = usuario.toObject ? usuario.toObject() : usuario;
    const { password, ...resto } = obj;
    return resto;
  }
}
