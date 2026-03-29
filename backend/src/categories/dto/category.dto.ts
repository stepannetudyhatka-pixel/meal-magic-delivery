import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
}

export class CreateCategoryDto {
  @ApiProperty({ example: 'Burgers' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Pizza', required: false })
  @IsString()
  @IsNotEmpty()
  name?: string;
}
