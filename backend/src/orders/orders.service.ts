import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    if (!dto.items.length) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // Validate coupon if provided
    if (dto.couponCode) {
      const coupon = await this.prisma.coupon.findFirst({
        where: { code: dto.couponCode.toUpperCase(), active: true },
      });
      if (!coupon) throw new NotFoundException('Invalid or expired coupon code');
    }

    return this.prisma.$transaction(async (tx) => {
      const productIds = dto.items.map((item) => item.productId);
      const productCount = await tx.product.count({ where: { id: { in: productIds } } });
      if (productCount !== dto.items.length) {
        throw new NotFoundException('One or more products not found');
      }

      return tx.order.create({
        data: {
          email: dto.email,
          phone: dto.phone,
          address: dto.address,
          totalPrice: dto.totalPrice,
          couponCode: dto.couponCode?.toUpperCase(),
          items: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { items: { include: { product: true } } },
      });
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  async searchByEmailAndPhone(email: string, phone: string, page = 1, limit = 6) {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 50) : 6;

    const where = { email, phone };
    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      }),
      this.prisma.order.count({ where }),
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
}
