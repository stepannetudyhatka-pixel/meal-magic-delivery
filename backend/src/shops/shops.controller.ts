import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ShopsService } from './shops.service';
import { CreateShopDto, UpdateShopDto } from './dto/shop.dto';

@ApiTags('shops')
@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all shops with optional rating filter' })
  @ApiQuery({ name: 'minRating', required: false, type: Number })
  @ApiQuery({ name: 'maxRating', required: false, type: Number })
  findAll(
    @Query('minRating') minRating?: string,
    @Query('maxRating') maxRating?: string,
  ) {
    const parsedMin = minRating ? Number(minRating) : undefined;
    const parsedMax = maxRating ? Number(maxRating) : undefined;
    return this.shopsService.findAll({ minRating: parsedMin, maxRating: parsedMax });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shop by ID with products' })
  findOne(@Param('id') id: string) {
    return this.shopsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new shop' })
  create(@Body() dto: CreateShopDto) {
    return this.shopsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a shop' })
  update(@Param('id') id: string, @Body() dto: UpdateShopDto) {
    return this.shopsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shop' })
  remove(@Param('id') id: string) {
    return this.shopsService.remove(id);
  }
}
