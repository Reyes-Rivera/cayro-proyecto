import { PartialType } from '@nestjs/mapped-types';
import { CreateSecurityquestionDto } from './create-securityquestion.dto';

export class UpdateSecurityquestionDto extends PartialType(CreateSecurityquestionDto) {}
