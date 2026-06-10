import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Usuario.name) private model: Model<UsuarioDocument>) {}
  async findByEmail(email: string) { return this.model.findOne({ email }).exec(); }
  async findById(id: string) { return this.model.findById(id).exec(); }
  async create(data: Partial<Usuario>) { return new this.model(data).save(); }
}
