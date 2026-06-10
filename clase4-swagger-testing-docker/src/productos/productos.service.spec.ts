import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProductosService } from './productos.service';
import { Producto } from './schemas/producto.schema';

describe('ProductosService', () => {
  let service: ProductosService;
  let mockModel: any;

  const mockProducto = {
    _id: '60d21b4667d0d8992e610c85',
    nombre: 'Test',
    precio: 100,
    stock: 5,
    categoria: 'Test',
    eliminado: false,
  };

  beforeEach(async () => {
    mockModel = {
      find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([mockProducto]) }),
      findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockProducto) }),
      findOneAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockProducto) }),
      save: jest.fn().mockResolvedValue(mockProducto),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        { provide: getModelToken(Producto.name), useValue: mockModel },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll() debería retornar array de productos', async () => {
    const result = await service.findAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it('findOne() debería retornar un producto', async () => {
    const result = await service.findOne('60d21b4667d0d8992e610c85');
    expect(result).toBeDefined();
  });
});
