import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active coupons' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllActive(@Query('page') page = 1, @Query('limit') limit = 6) {
    return this.couponsService.findAllActive(+page, +limit);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all coupons (including inactive)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.couponsService.findAll(+page, +limit);
  }

  @Get('validate/:code')
  @ApiOperation({ summary: 'Validate a coupon code' })
  validate(@Param('code') code: string) {
    return this.couponsService.validate(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get coupon by ID' })
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new coupon' })
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a coupon' })
  update(@Param('id') id: string, @Body() dto: UpdateCouponDto) {
    return this.couponsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a coupon' })
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }
}
