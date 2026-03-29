import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ShopsModule } from './shops/shops.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CouponsModule } from './coupons/coupons.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [PrismaModule, ShopsModule, ProductsModule, OrdersModule, CouponsModule, CategoriesModule],
})
export class AppModule {}
