import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

async function main() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('Meal Magic Delivery API')
    .setDescription('REST API for shops, products, coupons and orders')
    .setVersion('1.0.0')
    .addTag('shops')
    .addTag('products')
    .addTag('categories')
    .addTag('orders')
    .addTag('coupons')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const root = resolve(__dirname, '..', '..');
  const docsDir = resolve(root, 'docs');
  mkdirSync(docsDir, { recursive: true });
  writeFileSync(resolve(docsDir, 'swagger.json'), JSON.stringify(document, null, 2), 'utf8');

  await app.close();
  console.log('Swagger exported to docs/swagger.json');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
