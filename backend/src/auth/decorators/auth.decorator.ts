import { UseGuards, applyDecorators } from '@nestjs/common';
import { Role } from '../roles/role.enum';
import { Roles } from './roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';

export function Auth(roles: Role[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(JwtAuthGuard, RolesGuard)
  );
}
