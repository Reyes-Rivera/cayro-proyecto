import { PartialType } from '@nestjs/mapped-types';
import { CreateSecurityQuestionDto } from './create-securityquestion.dto';

export class UpdateSecurityquestionDto extends PartialType(CreateSecurityQuestionDto) {}
