import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { roles_key } from '../decorators/roles.decorator';
import { Role } from './role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector:Reflector){};
  canActivate(
    context: ExecutionContext,
  ): boolean  {
    const roles = this.reflector.getAllAndOverride<Role>(roles_key,[
      context.getHandler(),
      context.getClass(),
    ]);

    if(!roles) return true;
    const {user} = context.switchToHttp().getRequest();
    return roles === user.role;
  }
}
