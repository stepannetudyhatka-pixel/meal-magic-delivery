import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async findAllActive(page = 1, limit = 6) {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 50) : 6;

    const [items, total] = await Promise.all([
      this.prisma.coupon.findMany({
        where: { active: true },
        orderBy: { discountPercent: 'desc' },
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      }),
      this.prisma.coupon.count({ where: { active: true } }),
    ]);

    return {
      items,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
      hasMore: safePage * safeLimit < total,
    };
  }

  async findAll(page = 1, limit = 20) {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 20;

    const [items, total] = await Promise.all([
      this.prisma.coupon.findMany({
        orderBy: { discountPercent: 'desc' },
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      }),
      this.prisma.coupon.count(),
    ]);

    return {
      items,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
      hasMore: safePage * safeLimit < total,
    };
  }

  async findOne(id: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException(`Coupon ${id} not found`);
    return coupon;
  }

  async validate(code: string) {
    const coupon = await this.prisma.coupon.findFirst({
      where: { code: code.toUpperCase(), active: true },
    });
    if (!coupon) throw new NotFoundException('Invalid or expired coupon');
    return coupon;
  }

  async create(dto: CreateCouponDto) {
    return this.prisma.coupon.create({
      data: {
        name: dto.name,
        code: dto.code.toUpperCase(),
        discountPercent: dto.discountPercent,
        imageUrl: dto.imageUrl,
        active: dto.active ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateCouponDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.code) data.code = dto.code.toUpperCase();
    return this.prisma.coupon.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.coupon.delete({ where: { id } });
  }
}
