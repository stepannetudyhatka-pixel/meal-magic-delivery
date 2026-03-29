import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    shopId: string;
    categoryIds?: string[];
    page: number;
    limit: number;
    sortBy: string;
    sortDir: 'asc' | 'desc';
  }) {
    const where: any = { shopId: params.shopId };
    if (params.categoryIds?.length) {
      where.categoryId = { in: params.categoryIds };
    }

    const sortBy = ['name', 'price', 'createdAt'].includes(params.sortBy) ? params.sortBy : 'name';

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        orderBy: { [sortBy]: params.sortDir },
        include: { category: true, shop: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit),
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, shop: true },
    });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        price: dto.price,
        imageUrl: dto.imageUrl,
        shopId: dto.shopId,
        categoryId: dto.categoryId,
        discountPercent: dto.discountPercent ?? 0,
      },
      include: { category: true, shop: true },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { category: true, shop: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
