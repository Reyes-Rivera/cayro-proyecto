import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyProfileDto } from './create-company-profile.dto';

export class UpdateCompanyProfileDto extends PartialType(CreateCompanyProfileDto) {
  // Si tienes propiedades adicionales, asegúrate de incluirlas aquí.
  socialLinks?: any; // Si es un JSON, no necesitas definir un tipo específico, puede ser un `any`
}
