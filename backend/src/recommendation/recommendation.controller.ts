import { Controller, Post, Body } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { CreateCartRecommendationDto, CreateRecommendationDto } from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  getRecomendaciones(@Body() createRecommendationDto: CreateRecommendationDto) {
    return this.recommendationService.getRecommendations(
      createRecommendationDto.producto,
      8,
    );
  }
  @Post('carrito')
  async getRecomendacionesCarrito(@Body() body: CreateCartRecommendationDto) {
    return await this.recommendationService.getCartRecommendations(
      body.productos,
      8,
    );
  }
}
