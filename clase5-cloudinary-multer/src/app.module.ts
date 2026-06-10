import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProductosModule } from './productos/productos.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/gestion-inventario-c5',
    ),
    ThrottlerModule.forRoot({
      throttlers: [{
        ttl: parseInt(process.env.THROTTLE_TTL || '60'),
        limit: parseInt(process.env.THROTTLE_LIMIT || '10'),
      }],
    }),
    ProductosModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
