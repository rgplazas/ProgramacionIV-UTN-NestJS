import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>) {}

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<Usuario | null> {
    return this.usuarioModel.findById(id).exec();
  }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const nuevo = new this.usuarioModel(data);
    return nuevo.save();
  }
}
