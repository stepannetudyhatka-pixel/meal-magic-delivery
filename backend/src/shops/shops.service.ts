import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShopDto, UpdateShopDto } from './dto/shop.dto';

@Injectable()
export class ShopsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { minRating?: number; maxRating?: number }) {
    const where: any = {};
    if (filters?.minRating || filters?.maxRating) {
      where.rating = {};
      if (filters.minRating) where.rating.gte = filters.minRating;
      if (filters.maxRating) where.rating.lte = filters.maxRating;
    }
    return this.prisma.shop.findMany({ where, orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { id },
      include: { products: { include: { category: true } } },
    });
    if (!shop) throw new NotFoundException(`Shop ${id} not found`);
    return shop;
  }

  async create(dto: CreateShopDto) {
    return this.prisma.shop.create({
      data: {
        name: dto.name,
        imageUrl: dto.imageUrl,
        rating: dto.rating ?? 4.0,
      },
    });
  }

  async update(id: string, dto: UpdateShopDto) {
    await this.findOne(id);
    return this.prisma.shop.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.shop.delete({ where: { id } });
  }
}
