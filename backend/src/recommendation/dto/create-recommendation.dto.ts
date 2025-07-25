import { IsNotEmpty } from "class-validator";

export class CreateRecommendationDto {
    @IsNotEmpty({
        message: 'El nombre es requerido.',
    
    })
    producto: string;
}
// create-cart-recommendation.dto.ts
import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class CreateCartRecommendationDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  productos: string[];
}
